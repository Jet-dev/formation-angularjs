(function () {
    'use strict';

    /**
     Author :
     * Benjamin Barbier <benjamin.barbier@symbol-it.fr>
     * Florian Lemaire <f.lemaire@kiabi.com>

     Online documentation : https://github.com/gulpjs/gulp/blob/master/docs/API.md

     Main tasks :

     * gulp serve :
     serve application on http://localhost:9000

     * gulp serve watch :
     serve application on http://localhost:9000 and reload it when updating a file

     * gulp build :
     build the application on "/dist" folder

     * gulp build -f :
     build the application and do not stop the build process when EsLint errors are found

     * gulp serve-dist :
     serve builded application (dist folder) on http://localhost:9000

     * gulp deploy :
     push the builded version to Nexus

     Roadmap (todo) :
     - Ajouter les polices dans les dependencies bower de bootstrap (idem pour copy-ui-grid-resources)

     */

    var _ = require('underscore');
    var concat = require('gulp-concat');
    var connect = require('gulp-connect');
    var del = require('del');
    var eslint = require('gulp-eslint');
    var fs = require('fs');
    var gulp = require('gulp');
    var gulpFilter = require('gulp-filter');
    var file = require('gulp-file');
    var gulpif = require('gulp-if');
    var maven = require('gulp-maven-deploy');
    var ngAnnotate = require('gulp-ng-annotate');
    var inject = require('gulp-inject');
    var mainBowerFiles = require('main-bower-files');
    var minifycss = require('gulp-clean-css');
    var path = require('path');
    var proxy = require('http-proxy-middleware');
    var rename = require('gulp-rename');
    var replace = require('gulp-replace');
    var reporter = require('eslint-html-reporter');
    var rev = require('gulp-rev');
    var runSequence = require('run-sequence');
    var uglify = require('gulp-uglify');
    var livereload = require('gulp-livereload');
    var templateCache = require('gulp-angular-templatecache');
    var sourcemaps = require('gulp-sourcemaps');
    var jwt = require('jsonwebtoken');
    var redirects = require('redirects');
    var sass = require('gulp-sass');
    var packageJson = JSON.parse(fs.readFileSync('./package.json'));
    var distFolder = 'dist/' + packageJson.name + '-' + packageJson.version;
    var key = fs.readFileSync('./key','UTF-8');
    var token =  fs.readFileSync('./token','UTF-8');
    var properties =  fs.readFileSync('./src/app/properties.js','UTF-8');

    var argv = require('yargs')
        .alias('force', 'f')
        .argv;

    gulp.task('default', ['serve']);

    var src = {
        applicationScripts: [
            'src/app/*.module.js',
            'src/**/*.js',
            '!src/app/properties.js',
            '!src/i18n/*.json',
            '!src/**/*Test.js',
            '!src/**/*___jb_old___',
            '!src/rs/**',
            '!src/bower_components/**',
            '!src/**/*.spec.js'
        ],
        applicationStyle: [
            'src/app/**/*.css',
            'src/css/**/*.css',
            'src/app/**/*.scss',
            'src/css/**/*.scss'
        ],
        applicationTemplates: [
            'src/**/*.html',
            '!src/bower_components',
            'src/bower_components/fwk-anguarjs1-ng/src/fwk/**/*.html'
        ],
        vendorScripts: gulp.src(mainBowerFiles()).pipe(gulpFilter('**/*.js')),
        vendorStyle: gulp.src(mainBowerFiles()).pipe(gulpFilter('**/*.css')),
        vendorPictures: gulp.src(mainBowerFiles()).pipe(gulpFilter(['**/*.gif', '**/*.jpg', '**/*.jpeg', '**/*.png'])),
        devStyle: [
            'dev/**/*.css'
        ]
    };

    gulp.task('build', function (callback) {
        return runSequence(
            ['clean'],
            [
                'build-app-scripts',
                'build-app-styles',
                'build-app-templates',
                'build-vendor-scripts',
                'build-vendor-styles',
                'copy-vendor-pictures',
                'copy-app-assets',
                'copy-properties',
                'copy-index-html',
                'copy-i18n',
                'copy-fonts',
                'copy-images',
                'copy-ui-grid-resources'
            ],
            ['inject'],
            ['set-version'],
            callback);
    });

    gulp.task('serve', function (callback) {
        return runSequence(
            ['compile-dev-styles'],
            ['inject-dev'],
            ['serve-static'],
            ['watch-compile-dev-styles'],
            callback);
    });

    gulp.task('watch-compile-dev-styles', function (callback) {
        gulp.watch(src.applicationStyle, ['compile-dev-styles']);
    });

    function serve(root, livereload) {

        return connect.server({
            root: root,
            port: 9000,
            livereload: !!livereload,
            middleware: function (connect, opt) {
                return [
                    proxy('/rs', {
                        target: 'http://localhost:8080/AppliBlancheWebService4',
                        pathRewrite: {'^/rs': ''}
                    }),
                    redirects({
                        // Redirection URL finish by '*' for non-required parameter 'skipKerberos' :
                        '/mock_auth/oauth/authorize?response_type=token&client_id=NOM_APPLI&redirect_uri=http://localhost:9000/&scope=internal*': {
                            status: 302,
                            url: generateUrl()
                        }
                    })
                ]
            }
        });
    }

    function generateUrl(){
        var exp = Math.round((new Date()/1000)+(12*60*60));
        var profile = token.split('EXP_DO_NOT_REMOVE').join(exp);
         // We are sending the profile inside the token var
        var url = '/#/access_token=' + jwt.sign(profile, key, { algorithm: 'RS256' }) + '&token_type=implicit&expires_in='+exp+'&jti=POULP';
        return url;
    }

    gulp.task('serve-static', function () {
        return serve(['dev', 'src'], 'LIVE_RELOAD');
    });

    gulp.task('serve-dist', function () {
        return serve(distFolder);
    });

    gulp.task('deploy', function (callback) {
        return runSequence(
            ['remove-dist-properties', 'remove-translations'],
            ['send-to-nexus'],
            ['remove-dist-sources'],
            callback);
    });

    gulp.task('remove-dist-properties', function () {
        return del(distFolder + '/app/properties.js');
    });

    gulp.task('remove-translations', function () {
        return del(distFolder + '/i18n/*.json');
    });

    gulp.task('keep-app-folder', function () {
        return file('.keep', 1).pipe(gulp.dest(distFolder + '/app'));
    }),

    gulp.task('send-to-nexus', ['keep-app-folder'], function () {
        var repositoryId;
        var repositoryUrl;

        if ((packageJson.version).indexOf('SNAPSHOT') > -1) {
            repositoryId = 'RepositoryKiabiSnapshot';
            repositoryUrl = 'http://srvmvnmvnkiaprd001.kiabi.fr:8081/nexus/content/repositories/snapshot/';
        } else {
            repositoryId = 'RepositoryKiabiRelease';
            repositoryUrl = 'http://srvmvnmvnkiaprd001.kiabi.fr:8081/nexus/content/repositories/releases/';
        }

        return gulp.src(['./dist'])
            .pipe(maven.deploy({
                'config': {
                    'groupId': 'com.kiabi.frontend',
                    'type': 'zip',
                    'repositories': [{
                        'id': repositoryId,
                        'url': repositoryUrl
                    }]
                }
            }));
    });

    gulp.task('remove-dist-sources', function () {
        return del(distFolder);
    });

    gulp.task('clean', function () {
        return del('./dist');
    });

    gulp.task('build-app-scripts', function () {

        var isFinalVersion = (packageJson.version).indexOf('SNAPSHOT') === -1
            && (packageJson.version).indexOf('RC') === -1;

        return gulp.src(src.applicationScripts)
            .pipe(gulpif(!isFinalVersion, sourcemaps.init()))
            .pipe(eslint())
            .pipe(eslint.format(reporter, function (results) {
                fs.writeFileSync(path.join(__dirname, 'eslint-report.html'), results);
            }))
            .pipe(gulpif(!argv.force, eslint.failAfterError()))
            .pipe(concat('scripts.js'))
            .pipe(ngAnnotate())
            .pipe(uglify({
                compress: {
                    drop_console: true
                }
            }))
            .pipe(rename({suffix: '.min'}))
            .pipe(rev())
            .pipe(gulpif(!isFinalVersion, sourcemaps.write()))
            .pipe(gulp.dest(distFolder + '/scripts/'));
    });

    gulp.task('build-app-styles', function () {

        return gulp.src(src.applicationStyle)
            .pipe(sass().on('error', sass.logError))
            .pipe(concat('style.css'))
            .pipe(minifycss())
            .pipe(rename({suffix: '.min'}))
            .pipe(rev())
            .pipe(gulp.dest(distFolder + '/styles/'));
    });

    gulp.task('build-app-templates', function () {
        return gulp.src(src.applicationTemplates)
            .pipe(templateCache())
            .pipe(rev())
            .pipe(gulp.dest(distFolder + '/templates/'));
    });

    gulp.task('build-vendor-scripts', function () {

        return src.vendorScripts
            .pipe(concat('vendor.js'))
            .pipe(ngAnnotate()) // Requested for fwk-anguarjs1-ng
            .pipe(uglify())
            .pipe(rename({suffix: '.min'}))
            .pipe(rev())
            .pipe(gulp.dest(distFolder + '/scripts/'));
    });

    gulp.task('build-vendor-styles', function () {

        return src.vendorStyle
            .pipe(concat('vendor.css'))
            .pipe(minifycss())
            .pipe(rename({suffix: '.min'}))
            .pipe(rev())
            .pipe(gulp.dest(distFolder + '/styles/'));
    });

    gulp.task('copy-vendor-pictures', function () {

        return src.vendorPictures
            .pipe(gulp.dest(distFolder + '/styles/'));
    });

    gulp.task('copy-app-assets', function () {

        return gulp.src(['./src/app/**/*.jpg', './src/app/**/*.png'])
            .pipe(gulp.dest(distFolder + '/app'));
    });

    gulp.task('copy-ui-grid-resources', function () {

        return gulp.src([
            './src/bower_components/angular-ui-grid/ui-grid.ttf',
            './src/bower_components/angular-ui-grid/ui-grid.woff',
            './src/bower_components/angular-ui-grid/ui-grid.eot',
            './src/bower_components/angular-ui-grid/ui-grid.svg'
        ]).pipe(gulp.dest(distFolder + '/styles'));
    });

    gulp.task('copy-images', function () {

        return gulp.src('./src/images/**/*.*')
            .pipe(gulp.dest(distFolder + '/images'));
    });

    gulp.task('copy-properties', function () {

        return gulp.src('./src/app/properties.js')
            .pipe(gulp.dest(distFolder + '/app'));
    });

    gulp.task('copy-index-html', function () {

        return gulp.src('./src/index.html')
            .pipe(gulp.dest(distFolder));
    });

    gulp.task('copy-i18n', function () {

        return gulp.src('./src/i18n/*.json')
            .pipe(gulp.dest(distFolder + '/i18n'));
    });

    gulp.task('copy-fonts', function () {

        return gulp.src([
            './src/fonts/**/*.*',
            './src/bower_components/font-awesome/fonts/*.*'])
            .pipe(gulp.dest(distFolder + '/fonts'));
    });

    gulp.task('set-version', function () {

        return gulp.src([distFolder + '/index.html'])
            .pipe(replace('@@VERSION', packageJson.version))
            .pipe(gulp.dest(distFolder));
    });

    gulp.task('inject', function () {

        var applicationStyle = gulp.src(['./styles/style*.css'], {read: false, cwd: __dirname + '/' + distFolder});
        var applicationScript = gulp.src(['./scripts/scripts*.js'], {read: false, cwd: __dirname + '/' + distFolder});
        var applicationTemplate = gulp.src(['./templates/templates*.js'], {read: false, cwd: __dirname + '/' + distFolder});
        var vendorStyle = gulp.src(['./styles/vendor*.css'], {read: false, cwd: __dirname + '/' + distFolder});
        var vendorScript = gulp.src(['./scripts/vendor*.js'], {read: false, cwd: __dirname + '/' + distFolder});

        return gulp.src(distFolder + '/index.html')
            .pipe(inject(applicationStyle, {name: 'application', addRootSlash: false}))
            .pipe(inject(applicationScript, {name: 'application', addRootSlash: false}))
            .pipe(inject(applicationTemplate, {name: 'templates', addRootSlash: false}))
            .pipe(inject(vendorStyle, {name: 'vendor', addRootSlash: false}))
            .pipe(inject(vendorScript, {name: 'vendor', addRootSlash: false}))
            .pipe(gulp.dest(distFolder));
    });

    gulp.task('compile-dev-styles', function(){

        return gulp.src(src.applicationStyle)
            .pipe(sass().on('error', sass.logError))
            .pipe(gulp.dest('./dev/styles'));

    });

    gulp.task('inject-dev', function () {

        return gulp.src('./src/index.html')
            .pipe(inject(gulp.src(src.devStyle, {read: false}), {name: 'application', ignorePath: 'dev'}))
            .pipe(inject(gulp.src(src.applicationScripts, {read: false}), {name: 'application', ignorePath: 'src'}))
            .pipe(inject(src.vendorStyle, {name: 'vendor', ignorePath: 'src'}))
            .pipe(inject(src.vendorScripts, {name: 'vendor', ignorePath: 'src'}))
            .pipe(gulp.dest('./dev/'));
    });

    gulp.task('reload', function () {
        return gulp.src('./src/index.html')
            .pipe(livereload());
    });

    gulp.task('watch', function () {
        livereload.listen();
        gulp.watch(src.applicationTemplates.concat(src.applicationScripts, src.applicationStyle), ['reload']);
    });

})();
