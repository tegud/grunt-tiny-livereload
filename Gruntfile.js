'use strict';

module.exports = function (grunt) {
    // load all npm grunt tasks
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                'test/*.js'
            ],
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            }
        },

        connect: {
            server: {
                options: {
                    port: 1234,
                    hostname: '127.0.0.1',
                    base: 'static',
                    open: true
                }
            }
        },

        sass: {
            dist: {
                files: {
                    'static/example.css': 'static/src/example.scss'
                }
            }
        },

        watch: {
            sass: {
                files: 'static/**/*.scss',
                tasks: ['sass', 'tinylr-reload'],
                options: {
                    nospawn: true
                }
            }
        },

        mochacli: {
            src: ['test/**/*.js'],
            options: {
                timeout: 3000,
                ignoreLeaks: false,
                ui: 'bdd',
                reporter: 'spec'
            }
        },

        'tinylr-start': {
            reload: {
                options: {}
            }
        }

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    grunt.registerTask('default', ['connect', 'tinylr-start', 'watch']);

};
