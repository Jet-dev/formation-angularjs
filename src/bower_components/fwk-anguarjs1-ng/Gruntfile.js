'use strict';

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Allow rewriting internal rules to mock API
    var rewriteRulesSnippet = require('grunt-connect-rewrite/lib/utils').rewriteRequest,
        proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest,
        livereloadSnippet = require('connect-livereload')();

    // Define the configuration for all the tasks
    grunt.initConfig({
        //access to the package file
        pkg: grunt.file.readJSON('package.json'),

        // Watches files and reload page (or file for CSS)
        watch: {
            src: {
                files: [
                    'src/**/*',
                    '!src/**/*Test.js',
                    '!src/**/*___jb_old___',
					'!src/rs/**',
                    '!src/bower_components/**'
                ],
                options: {
                    livereload: true
                }
            }
        },

        // The actual grunt serve settings
        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: '127.0.0.1'
                //livereload: true
                //open: 'chrome'
            },

            rules: [
                { from: '^(/rs/.*)/?$', to: '$1.json' }
            ],
            srcMock: {
                options: {
                    base: 'src',
                    middleware: function (connect, options) {
                        return [
                            livereloadSnippet,
                            rewriteRulesSnippet,
                            connect.static(options.base)
                        ];
                    }
                }
            },

            proxies: [
                {
                    context: '/rs',
                    host: '127.0.0.1',
                    port: 8080,
                    rewrite: {
                        '^/rs' : '/AppliBlancheWebService4'
                    }
                }
            ],
            srcProxy: {
                options: {
                    base: 'src',
                    middleware: function (connect, options) {
                        return [
                            livereloadSnippet,
                            proxySnippet,
                            connect.static(options.base)
                        ];
                    }
                }
            },

            dist: {
                options: {
                    port: 9111,
                    base: 'dist'
                }
            }
        },

        // Make sure JS code styles are ok and there are no obvious mistakes
        eslint: {
            options: {
                configFile: '.eslintrc'
            },
            target: [
                'src/app/**/*.js'
                //,'src/js/fwk/**/*.js'
            ]
        },

        // Make sure CSS code styles are ok and there are no obvious mistakes
        csslint: {
            options: {
                csslintrc: '.csslintrc'
            },
            src: {
                options: {
                    import: false
                },
                src: [
                    'src/css/*.css'
                ]
            }
        },

        // Remove generated dirs and files
        clean: {
            dist: {
                src: [
                    'dist',
                    'dist.tar.gz',
                    'appliblanchejs-*.zip'
                ]
            },
            tests: {
                src: [
                    'coverage'
                ]
            }
        },

        //process HTML to remove or concat files
        processhtml: {
            options : {
                commentMarker : 'process',
                data: {
                    version: '<%= pkg.version %>'
                }
            },
            dist : {
                files: {
                    'dist/index.html': ['dist/index.html']
                }
            }
        },

        // Renames files for browser caching purposes
        filerev: {
            distToRevvedDist: {
                src: [
                    'dist/**/*.js',
                    'dist/**/*.css',
                    '!dist/app/properties.js' //exclude properties.js because will be deployed on the server and different by env
                ]
            }
        },

        // Replace renamed filenames
        usemin: {
            html: [
                'dist/index.html'
            ]
        },

        // Copies target files to dist
        copy: {
            srcToDist: {
                expand: true,
                cwd: 'src',
                dest: 'dist',
                src: [
                    '**/*',
                    '!**/*.spec.js',
                    '!test.html',
                    '!rs/**',
                    '!js/mock/**',
                    '!*___jb_old___',
                    '!app/properties.js'
                ]
            }
        },

        // Compress dist to tar.gz archive
        compress: {
            main: {
                options: {
                    archive: 'dist.tar.gz'
                },
                files: [
                    {
                        expand: true,
                        cwd: 'dist',
                        src: ['**'],
                        dest: ''
                    }
                ]
            }
        },

        // Test runner
        karma: {
            tests: {
                configFile: 'karma.conf.js',
                singleRun: true
            },
            testsAndWatch: {
                configFile: 'karma.conf.js'
            }
        },

        // Regenerate bower dependencies in index.html and karma.conf.js
        bowerInstall: {
            src: {
                src: [
                    'src/index.html'
                ],
                exclude: ['fancytree']
            },
            tests: {
                src: [
                    'karma.conf.js'
                ],
                exclude: ['fancytree'],
                devDependencies: true,
                fileTypes: {
                    js: {
                        block: /(([ \t]*)\/\/\s*bower:*(\S*))(\n|\r|.)*?(\/\/\s*endbower)/gi,
                        detect: {
                            js: /['"](.+)['"],/gi
                        },
                        replace: {
                            js: '\'{{filePath}}\','
                        }
                    }
                }
            }
        },

        //minify css (perf + obfuscation)
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'dist/css',
                    src: '**/*.css',
                    dest: 'dist/css'
                }]
            }
        },

        //minify html (perf + obfuscation)
        htmlmin: {
            options: {
                removeComments: true,
                collapseWhitespace: true
            },
            target: {
                files: [{
                    expand: true,
                    cwd: 'dist/app',
                    src: '**/*.html',
                    dest: 'dist/app'
                },
                    {
                        src: 'dist/index.html',
                        dest: 'dist/index.html'
                    }
                ]
            }
        },

        concat: {
          dist  :{
              src : ['dist/app/**/*.js'],
              dest: 'dist/app/app.js'
          }
        },

        //annotate the angular JS directive and controller to allow js uglification
        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            app: {
                files: [
                    {
                        expand: true,
                        cwd: 'dist/app',
                        src: '**/*.js',
                        dest: 'dist/app'
                    }
                ]
            },
            js: {
                files: [
                    {
                        expand: true,
                        cwd: 'dist/js',
                        src: '**/*.js',
                        dest: 'dist/js'
                    }
                ]
            }
        },

        //uglify the js : minify it and obfucate it to complexify the works of possible hackers and also for performance
        //we generate sourcemap for snapshot and RC version to allow developpers to debug the JS in these env
        uglify: {
            options: {
                sourceMap: '<%= pkg.version.indexOf("-RC") >= 0 || pkg.version.indexOf("-SNAPSHOT") >= 0 %>',
                sourceMapIncludeSources: true
            },
            app: {
                files: [{
                    expand: true,
                    cwd: 'dist/app',
                    src: '**/*.js',
                    dest: 'dist/app'
                }]
            },
            js: {
                files: [{
                    expand: true,
                    cwd: 'dist/js',
                    src: '**/*.js',
                    dest: 'dist/js'
                }]
            }
        },

        //deploy to maven repo
        maven: {
            options: {
                goal: 'deploy',
                groupId: 'com.kiabi.frontend',
                url: 'http://srvmvnmvnkiaprd001.kiabi.fr:8081/nexus/content/repositories/releases/',
                repositoryId: 'RepositoryKiabiRelease'
            },
            deploy: {
                files : [{
                    cwd: 'dist/',
                    expand: true,
                    src: '**'
                }]
            },
            snapshot: {
                options: {
                    url: 'http://srvmvnmvnkiaprd001.kiabi.fr:8081/nexus/content/repositories/snapshot/',
                    repositoryId: 'RepositoryKiabiSnapshot'
                },
                files : [{
                    cwd: 'dist/',
                    expand: true,
                    src: '**'
                }]
            }
        }
    });

    grunt.registerTask('serve_mock', [
        'configureRewriteRules',
        'connect:srcMock',
        'watch'
    ]);

    grunt.registerTask('serve_proxy', [
        'configureProxies',
        'connect:srcProxy',
        'watch'
    ]);

    grunt.registerTask('test', [
        'clean:tests',
        'eslint',
        'csslint',
        'karma:tests'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'copy',
        'ngAnnotate',
        'concat:dist',
        'processhtml:dist',
        'filerev',
        'usemin',
        'cssmin',
        'uglify',
        'htmlmin'
    ]);

    grunt.registerTask('package', [
        'build',
        'compress'
    ]);

    grunt.registerTask('deploy_release', [
        'build',
        'compress',
        'maven:deploy'
    ]);

    grunt.registerTask('deploy_snapshot', [
        'build',
        'compress',
        'maven:snapshot'
    ]);

    grunt.registerTask('default', [
        'test',
        'build'
    ]);
};
