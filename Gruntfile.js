module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            dist: {
                options: {
                    sourcemap: true,
                    style: 'expanded'
                },
                files: {
                    'css/style.css': 'scss/style.scss'
                }
            }
        },
        autoprefixer: {
            options: {
                map: true
            },
            dist: {
                files: {
                    'css/style.css': 'css/style.css'
                }
            }
        },
        watch: {
            css: {
                files: 'scss/*.scss',
                tasks: ['sass', 'autoprefixer']
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.registerTask('default', ['watch']);
}
