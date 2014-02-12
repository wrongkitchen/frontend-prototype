'use strict';

var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({ port: LIVERELOAD_PORT });
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);
    // Project configuration
    grunt.initConfig({
        // Task configuration
        SRC_PATH : "app",
        BUILD_PATH : "dist",
        compass: {
            options: {
                sassDir: '<%= SRC_PATH %>/scss',
                cssDir:'<%= SRC_PATH %>/css',
                imagesDir: '../imgs',
                fontsDir: '../fonts',
                javascriptsDir: '../js',
                httpImagesPath: '<%=BUILD_PATH%>/imgs',
                httpFontsPath: '<%=BUILD_PATH%>/fonts'
            },
            dist: {
                options: {
                    debugInfo   : false,
                    cssDir      : '<%=BUILD_PATH%>/css',
                    outputStyle : 'compressed'
                }
            },
            server: {
                options: {
                    cssDir  : '<%=SRC_PATH%>/css'
                }
            }
        },
        requirejs: {
            dist: {
                options: {
                    appDir: '<%= SRC_PATH %>/js',
                    dir: '<%= BUILD_PATH %>/js',
                    baseUrl: '.',
                    mainConfigFile: '<%= SRC_PATH %>/js/config.js',
                    optimize: 'uglify',
                    modules:[
                        { name : 'main' }
                    ],
                    fileExclusionRegExp: /^\./,
                    findNestedDependencies: true,
                    inlineText: true
                }
            }
        },
        sprite:{
            icons: {
                src:'<%=SRC_PATH%>/imgs/sprites/icons/**/*.png',
                outputStyle: 'scss', 
                destImg: '<%=SRC_PATH%>/imgs/sprite-icons.png',
                destCSS:'<%=SRC_PATH%>/scss/sprite/sprite-icons.scss',
                algorithm: 'binary-tree',
                padding: 2,
                engine: 'auto',
                imgPath: '../imgs/sprite-icons.png'
            },
            arrows: {
                src:'<%=SRC_PATH%>/imgs/sprites/arrows/**/*.png',
                outputStyle: 'scss',
                destImg: '<%=SRC_PATH%>/imgs/sprite-arrows.png',
                destCSS:'<%=SRC_PATH%>/scss/sprite/sprite-arrows.scss',
                algorithm: 'binary-tree',
                padding: 2,
                engine: 'auto',
                imgPath: '../imgs/sprite-arrows.png'
            }
        },
        htmlmin: {
            dist: {
                options: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    removeCommentsFromCDATA: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= SRC_PATH %>',
                    src: ['*.html'],
                    dest: '<%= BUILD_PATH %>'
                }]
            }
        },
        copy:{
            dist:{
                files:[
                    { 
                        expand: true, 
                        cwd: '<%=SRC_PATH%>', 
                        dest: '<%=BUILD_PATH%>',
                        nonull: true,
                        src: ['imgs/**', 'asset/**', 'components/**', 'fonts/**', 'tmpl/**']
                    }
                ]
            }
        },
        watch: {
            compass: {
                files: ['<%= SRC_PATH %>/scss/**/*.{sass,scss}'],
                tasks: ['compass:server']
            },
            sprite: {
                files: ['<%= SRC_PATH %>/imgs/sprites/**/*.{png,jpg,gif}'],
                tasks: ['sprite']
            },
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    '<%=SRC_PATH%>/css/**/*.css',
                    '<%=SRC_PATH%>/imgs/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                    '<%=SRC_PATH%>/*.html',
                    '<%=SRC_PATH%>/tmpl/**/*.{hbs,html,tmpl}'
                ]
            }
        },
        connect: {
            options: {
                port: 9000
            },
            dist:{
                options: {
                    port: 50000,
                    base: 'dist',
                    keepalive: 'true'
                }
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, 'app')
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                url: 'http://localhost:<%= connect.options.port %>'
            },
            dist:{
                url: 'http://localhost:<%= connect.dist.options.port %>'
            }
        }
    });
    

    grunt.registerTask('server', [
        'open:server',
        'connect:livereload', 
        'watch'
    ]);
    grunt.registerTask('build', [
        'compass:dist',
        'copy:dist',
        'htmlmin',
        'requirejs:dist'
        // 'open:dist',
        // 'connect:dist'
    ]);
    // Default task
    grunt.registerTask('default', []);
};
