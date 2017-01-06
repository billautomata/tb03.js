var synaptic = require('synaptic')
var d3 = require('d3')

var Architect = synaptic.Architect
var Trainer = synaptic.Trainer

module.exports = function (patterns) {
  var TRAINING_RATE = 0.01
  var ITERATIONS = 1000.0
  var EVERY = Math.floor(ITERATIONS / 10.0)

  // patterns.length = 3

  var myNetwork = new Architect.LSTM(2, 3, 4)
  // myNetwork = new Architect.Liquid(5, 20, 4)
  // myNetwork = new Architect.Perceptron(5, 8, 4, 4)
  myNetwork = new Architect.Perceptron(5, 8, 4)

  var trainer = new Trainer(myNetwork)

  console.log(patterns)

  // find the taxonomy of outputs
  var note_range = [1000, -1]
  var accent_range = [1000, -1]
  var slide_range = [1000, -1]
  var state_range = [1000, -1]

  patterns.forEach(function (p) {
    p.steps.forEach(function (step) {
      note_range = [ Math.min(step.note, note_range[0]), Math.max(step.note, note_range[1]) ]
      accent_range = [ Math.min(step.accent, accent_range[0]), Math.max(step.accent, accent_range[1]) ]
      slide_range = [ Math.min(step.slide, slide_range[0]), Math.max(step.slide, slide_range[1]) ]
      state_range = [ Math.min(step.state, state_range[0]), Math.max(step.state, state_range[1]) ]
    })
  })

  console.log('note range', note_range)
  console.log('accent range', accent_range)
  console.log('slide range', slide_range)
  console.log('state range', state_range)

  var scale_step = d3.scaleLinear().domain([0, 15]).range([0, 1])
  var scale_note = d3.scaleLinear().domain(note_range).range([0, 1])
  var scale_accent = d3.scaleLinear().domain(accent_range).range([0, 1])
  var scale_slide = d3.scaleLinear().domain(slide_range).range([0, 1])
  var scale_state = d3.scaleLinear().domain(state_range).range([0, 1])

  // build training data
  var training_set = []

  patterns.forEach(function (p) {
    p.steps.forEach(function (step, step_idx) {
      //
      var previous_step
      if (step_idx > 0) {
        previous_step = p.steps[step_idx - 1]
      } else {
        previous_step = step
      }
      var packed_input = [
        scale_step(step_idx),
        scale_note(previous_step.note),
        scale_state(previous_step.state),
        scale_accent(previous_step.accent),
        scale_slide(previous_step.slide)
      ]

      training_set.push({
        input: packed_input,
        output: [
          scale_note(step.note),
          scale_state(step.state),
          scale_slide(step.slide),
          scale_accent(step.accent),
        ]
      })
    })
  })

  console.log(training_set)
  //

  function run () {
    // myNetwork.clear()
    trainer.train(training_set, {
      rate: TRAINING_RATE,
      iterations: ITERATIONS,
      error: .005,
      shuffle: true,
      schedule: {
        every: EVERY,
        do: function (data) {
          // custom log
          console.log('error', data.error, 'iterations', data.iterations, 'rate', data.rate)
          d3.select('div#patterns').selectAll('*').remove()
          var generated_steps = []

          // myNetwork.clear()

          d3.range(0, 16).forEach(function (step_idx) {
            var previous_step
            if (step_idx > 0) {
              previous_step = generated_steps[step_idx - 1]
            } else {
              previous_step = {
                note: 40,
                accent: 1,
                slide: 0,
                state: 1
              }
            }

            var packed_input = [
              scale_step(step_idx),
              scale_note(previous_step.note),
              scale_accent(previous_step.accent),
              scale_slide(previous_step.slide),
              scale_state(previous_step.state)
            ]

            var output = myNetwork.activate(packed_input)

            var step = {
              note: Math.floor(scale_note.invert(output[0])),
              accent: Math.floor(scale_accent.invert(output[1]) + 0.5),
              slide: Math.floor(scale_slide.invert(output[2]) + 0.5),
              state: Math.floor(scale_state.invert(output[3]) + 0.5)
            }

            step.step = step_idx
            generated_steps.push(step)
          })

          // console.log(generated_steps)

          require('./draw_pattern.js')({
            parent: d3.select('div#patterns'),
            name: 'generated' + data.iterations,
            data: {
              end_step: '15',
              steps: generated_steps,
              triplet: '0'
            }
          })
        }
      }
    })
    setTimeout(run, 10)
  }

  run()

}
