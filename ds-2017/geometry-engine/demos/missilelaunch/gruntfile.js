var fs = require('fs');
var path = require('path');

module.exports = function (grunt) {

    var packagedetails = grunt.file.readJSON('package.json');

    // Project configuration.
    grunt.initConfig({
        pkg: packagedetails,

        ts: {
            // set default options
            options: {
                comments: true,
                module: "amd",
                target: 'es5',
                sourceMap: false,
                declaration: false,
                noImplicitAny: false,
                preserveConstEnums: true,
                fast: 'never'
            },

            // Compile the Raw Geometry Engine. ie. the Direct port of Java
           
            "app": {
                src: ['www/js/**/*.ts']
            }
        },

        less: {
            app: {
                options: {
                    strictImports: true,
                    compress: true
                },
                files: [{
                    expand: true,
                    cwd: 'www/assets/css',
                    src: ['**/*.less'],
                    filter: function (filepath) {
                        return (filepath.indexOf(".inline.less") < 0);
                    },
                    dest: 'www/assets/css',
                    ext: '.css'
                }]
            }
        },

        watch: {
            "app": {
                files: ['www/assets/css/**/*.less','www/js/**/*.ts'],
                tasks: ['less:app', 'ts:app'],
                options: {
                    nospawn: true
                }
            }
        }
    });

    /* Load all the Grunt NPM Tasks Needed */
 
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-ts');


grunt.registerTask('observe', ["less:app","ts:app", "watch:app"]);



};