module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-run')
  grunt.loadNpmTasks('grunt-express-server')

  // grunt.registerTask('serve', [ 'browserify', 'express:dev', 'watch'])
  // grunt.registerTask('default', ['standard:webapp', 'express', 'watch'])
  grunt.registerTask('default', ['run', 'express', 'watch'])

  grunt.initConfig({
    express: {
      options: { },
      dev: {
        options: {
          script: './express_server.js'
        }
      }
    },
    run: {
      standard: {
        cmd: 'standard',
        args: [ '-verbose', '-F', './webapp/*', './webapp/**/*', './webapp/**/**/*' ]
      },
      browserify: {
        cmd: 'browserify',
        args: [ './webapp/main.js', '-t', 'brfs', '--debug', '-o', './public/js/build/webapp.js' ]
      }
    },
    watch: {
      client_js: {
        files: [ './webapp/*.js', './public/index.html' ],
        tasks: ['run:standard', 'run:browserify'],
        options: {
          livereload: {
            port: 35729
          }
        }
      }
    }
  })
}
