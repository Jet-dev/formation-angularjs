'use strict';

module.exports = function (config) {
    config.set({
        basePath: '',

        frameworks: ['jasmine'],

        files: [
            // do not edit bower dependencies manually, use "grunt bowerInstall:tests"
            // bower:js
            'src/bower_components/jquery/jquery.js',
            'src/bower_components/jquery-ui/ui/jquery-ui.js',
            'src/bower_components/angular/angular.js',
            'src/bower_components/angular-route/angular-route.js',
            'src/bower_components/angular-resource/angular-resource.js',
            'src/bower_components/bootstrap/dist/js/bootstrap.js',
            'src/bower_components/angular-translate/angular-translate.js',
            'src/bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
            'src/bower_components/angular-ui-date/src/date.js',
            'src/bower_components/highcharts-release/highcharts.js',
            'src/bower_components/highcharts-release/highcharts-more.js',
            'src/bower_components/highcharts-release/modules/exporting.src.js',
            'src/bower_components/underscore/underscore.js',
            'src/bower_components/angular-mocks/angular-mocks.js',
            // endbower

            'src/bower_components/fancytree/dist/jquery.fancytree.js',
            'src/app/**/*.js',
            'src/js/fwk/**/*.js'
        ],

        reporters: ['dots', 'coverage'],

        preprocessors: {
            'src/**/*.html': ['ng-html2js'],
            'src/**/*!(Test).js': ['coverage']
        },

        coverageReporter: {
            type: 'lcov',
            dir: 'coverage/'
        },

        // web server port
        port: 9001,

        // cli runner port
        runnerPort: 9100,

        colors: true,

        // level of logging: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,

        autoWatch: true, // => Gruntfile.js

        browsers: [
            'Chrome'
        ]
    });
};
