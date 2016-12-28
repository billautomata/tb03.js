console.log('loaded')

var d3 = require('d3')
var parse_pattern = require('./../lib/parse_pattern_file.js')

require('./file_event_listener.js')()

var file_utils = require('./file_utils.js')

var disk = file_utils.get_files()
// console.log(disk)

var patterns = []

disk.forEach(function (file) {
  if (file.name.indexOf('TRACK') !== -1) {
    // track file
  } else {
    // require('./draw_pattern.js')({
    //   parent: d3.select('div#patterns'),
    //   name: file.name,
    //   data: parse_pattern(window.atob(file.data.split(',')[1]))
    // })
    var o = parse_pattern(window.atob(file.data.split(',')[1]))
    o.name = file.name
    patterns.push(o)
  }
})

patterns = patterns.filter(function (o) {
  var non_empty_pattern = o.steps.filter(function (_o) { return _o.note === 48 })
  if (non_empty_pattern.length === 16) {
    return false
  } else {
    return true
  }
})

console.log(patterns)

require('./neural_network.js')(patterns)

require('./scale_note.js')()
