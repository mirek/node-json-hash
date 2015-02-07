module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-6to5')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-mocha-test')
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      lib: 'lib/'
    },
    copy: {
      crypto: {
        files: {
          'lib/crypto.js': 'src/crypto.js'
        }
      }
    },
    '6to5': {
      options: {
        sourceMap: true
      },
      lib: {
        files: [
          {
            expand: true,
            cwd: 'src',
            src: ['*.js'],
            dest: 'lib'
          }
        ]
      }
    },
    watch: {
      coffee: {
        files: ['src/*.js'],
        tasks: ['build']
      }
    },
    mochaTest: {
      test: {
        options: {
          bail: true,
          reporter: 'spec',
          require: [ '6to5/register' ]
        },
        src: ['spec/**/*.js']
      }
    }
  })
  grunt.registerTask('test', ['mochaTest'])
  grunt.registerTask('build', ['copy:crypto', '6to5'])
  grunt.registerTask('rebuild', ['clean', 'build'])
  grunt.registerTask('default', ['rebuild'])
}
