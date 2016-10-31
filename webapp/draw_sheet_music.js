var d3 = require('d3')

module.exports = function sheet_music (options) {
  // options.parent
  // options.data
  var div_local = options.parent.append('div')

  var w = 300
  var h = 100

  var note_range_to_display = [30, 74]

  var scale_x = d3.scaleLinear().domain([0, 16]).range([(w * 0.1), (w - (w * 0.1))])
  var scale_y_note_to_line = d3.scaleLinear().domain(note_range_to_display).range([0, 64])
  var scale_y_line_to_y = d3.scaleLinear().domain([0, 64]).range([h, 0])
  function note_to_y (v) {
    return scale_y_line_to_y(scale_y_note_to_line(v))
  }

  var svg = div_local.append('svg')
    .attr('viewBox', [0, 0, w, h].join(' '))
    .attr('preserveAspectRatio', 'xMidYMid')
    .attr('width', '100%')

  // draw treble clef
  // draw bass
  var bottom = 50
  var top = 72
  d3.range(50, 72, 2).forEach(function (v) {
    if (v !== 60) {
      svg.append('line')
        .attr('x1', scale_x(-1))
        .attr('y1', note_to_y(v))
        .attr('x2', scale_x(17))
        .attr('y2', note_to_y(v))
        .attr('stroke', 'black')
        .attr('stroke-width', '0.1px')
    }
  })

  options.data.steps.forEach(function (step, step_idx) {
    if (step.note < bottom) {
      // draw lines
      // var i = Number(step.note)
      if (step.state === 1) {
        for (var i = Number(step.note); i < bottom; i++) {
          if (i % 2 === 0) {
            svg.append('line')
              .attr('x1', scale_x(step_idx) - (scale_x(1) * 0.1))
              .attr('y1', note_to_y(i))
              .attr('x2', scale_x(step_idx) + (scale_x(1) * 0.1))
              .attr('y2', note_to_y(i))
              .attr('stroke', 'black')
              .attr('stroke-width', '0.1px')
          }
        }
        // note head
        svg.append('circle')
          .attr('cx', scale_x(step_idx))
          .attr('cy', note_to_y(step.note))
          .attr('r', '2px')
          .attr('stroke', 'black')
          .attr('stroke-width', '0.1px')

        // flag
        if (Number(step.note) < 60) {
          // flag up
          svg.append('line')
            .attr('x1', scale_x(step_idx) + 2)
            .attr('y1', note_to_y(step.note) + 0.5)
            .attr('x2', scale_x(step_idx) + 2)
            .attr('y2', note_to_y(step.note + 6))
            .attr('stroke', 'black')
            .attr('stroke-width', '0.3px')
        }

      }
    }

  })

}
