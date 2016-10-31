var d3 = require('d3')

var note_lut = require('./scale_note.js')()

module.exports = function sheet_music (options) {
  // options.parent
  // options.data

  var div_local = options.parent.append('div')

  var w = 300
  var h = 300

  var midi_note_range = [12, 121]

  var note_range_to_display = [30, 74]

  var scale_x = d3.scaleLinear().domain([0, 16]).range([(w * 0.1), (w - (w * 0.1))])
  var scale_x_all_notes = d3.scaleLinear().domain([0, 108]).range([(w * 0.1), (w - (w * 0.1))])
  var scale_y = d3.scaleLinear().domain([0, 64]).range([h - 10, 10])

  var svg = div_local.append('svg')
    .attr('viewBox', [0, 0, w, h].join(' '))
    .attr('preserveAspectRatio', 'xMidYMid')
    .attr('width', '100%')
    // .style('background-color', 'rgb(200,200,200)')

  var staff_lines = [ 43, 47, 50, 53, 57, 64, 67, 71, 74, 77 ]

  // for each midi note
  d3.range(midi_note_range[0], midi_note_range[1]).forEach(function (note_value, display_idx) {
    var note = note_lut[note_value]
    if (note.name.indexOf('#') === -1) {
      if (staff_lines.indexOf(note_value) !== -1) {
        svg.append('line')
          .attr('id', '_' + note_value)
          .attr('x1', scale_x(-1))
          .attr('y1', scale_y(note.draw_index))
          .attr('x2', scale_x(17))
          .attr('y2', scale_y(note.draw_index))
          .attr('stroke', 'black')
          .attr('stroke-width', '0.3px')
      }
      if (note.isLine === true) {
        svg.append('line')
          .attr('id', '_' + note_value)
          .attr('x1', scale_x_all_notes(display_idx))
          .attr('y1', scale_y(note.draw_index))
          .attr('x2', scale_x_all_notes(display_idx) + 15)
          .attr('y2', scale_y(note.draw_index))
          .attr('stroke', 'red')
          .attr('stroke-width', '0.2px')
      }
      svg.append('text').text([note_value, note.name, note.octave].join(' '))
        .attr('x', scale_x_all_notes(display_idx))
        .attr('y', scale_y(note.draw_index))
        .attr('dy', '0.33em')
        .style('font-size', '5px')
    }
  })

  // draw lines
  d3.range(midi_note_range[0], midi_note_range[1]).forEach(function (note_value, display_idx) {
    var note = note_lut[note_value]
    if (note.isLine === true) {
    }
  })

  return
  // options.data.steps.forEach(function (step, step_idx) {
  //   if (step.note < bottom) {
  //     // draw lines
  //     // var i = Number(step.note)
  //     if (step.state === 1) {
  //       for (var i = Number(step.note); i < bottom; i++) {
  //         if (i % 2 === 0) {
  //           svg.append('line')
  //             .attr('x1', scale_x(step_idx) - (scale_x(1) * 0.1))
  //             .attr('y1', note_to_y(i))
  //             .attr('x2', scale_x(step_idx) + (scale_x(1) * 0.1))
  //             .attr('y2', note_to_y(i))
  //             .attr('stroke', 'black')
  //             .attr('stroke-width', '0.1px')
  //         }
  //       }
  //       // note head
  //       svg.append('circle')
  //         .attr('cx', scale_x(step_idx))
  //         .attr('cy', note_to_y(step.note))
  //         .attr('r', '2px')
  //         .attr('fill', 'black')
  //         .attr('stroke', 'none')
  //
  //       // flag
  //       if (Number(step.note) < 60) {
  //         // flag up
  //         svg.append('line')
  //           .attr('x1', scale_x(step_idx) + 2)
  //           .attr('y1', note_to_y(step.note) + 0.5)
  //           .attr('x2', scale_x(step_idx) + 2)
  //           .attr('y2', note_to_y(step.note + 6))
  //           .attr('stroke', 'black')
  //           .attr('stroke-width', '0.3px')
  //       }
  //     } {
  //     svg.append('circle')
  //       .attr('cx', scale_x(step_idx))
  //       .attr('cy', note_to_y(48))
  //       .attr('r', '2px')
  //       .attr('fill', 'blue')
  //       .attr('stroke', 'none')
  //     }
  //   }
  //
  // })

}
