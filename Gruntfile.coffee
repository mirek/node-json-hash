
module.exports = (grunt) ->
  grunt.loadNpmTasks 'grunt-mocha-test'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-codo'

  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'

    copy:
      crypto:
        files:
          'lib/crypto.js': 'src/crypto.js'

    coffee:
      compile:
        files:
          'lib/index.js': 'src/index.coffee'

    watch:
      coffee:
        files: [ 'src/index.coffee' ]
        tasks: [ 'coffee' ]

    mochaTest:
      test:
        options:
          bail: true
          reporter: 'spec'
          require: [
            'coffee-script'
          ]
        src: [ 'spec/**/*.coffee' ]

  grunt.registerTask 'doc', [ 'codo' ]
  grunt.registerTask 'test', [ 'mochaTest' ]
  grunt.registerTask 'compile', [ 'coffee' ]
  grunt.registerTask 'default', [ 'compile', 'copy:crypto' ]
