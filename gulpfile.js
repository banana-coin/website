'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var del = require('del');
var htmlImport = require('gulp-html-import');
var removeHtmlComments = require('gulp-remove-html-comments');
var gutil = require('gulp-util');
var ftp = require('vinyl-ftp');

var release = true;

gulp.task('default', ['styles', 'js', 'static', 'img']);

var out = 'build/';

var scripts = [
    'node_modules/jquery/dist/jquery.js',
    'node_modules/bootstrap/dist/js/bootstrap.js',
    'node_modules/jquery-fancybox/source/js/jquery.fancybox.js',
    'js/index.js',
];

gulp.task('clean', function() {
    return del([out], { force: true });
});

gulp.task('styles', function() {
    gulp.src(['node_modules/bootstrap/dist/css/bootstrap.css', 'node_modules/bootstrap/dist/css/bootstrap-theme.css', 'scss/index.scss'])
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(concat('styles.css'))
        .pipe(gulp.dest(out));
});

gulp.task('js', function() {
    gulp.src(scripts)
        .pipe(concat('app.js'))
        .pipe(uglify({ compress: { drop_console: release } }))
        .pipe(gulp.dest(out + 'js/'));
});

gulp.task('static', function() {
    var langs = {
        'en': 'en/',
        'ru': 'ru/',
        'cn': 'cn/',
        'kr': 'kr/',
        'jp': 'jp/'
    };
    var mainLang = 'en';
    for (var l in langs) {
        var folders = ['plantation/', 'faq/', 'plan/'];
        gulp.src([langs[l] + 'index.html'])
            .pipe(htmlImport('./templates/' + langs[l]))
            .pipe(removeHtmlComments())
            .pipe(gulp.dest(out + (l === mainLang ? '' : langs[l])));
        for (var f = 0; f < folders.length; f++) {
            gulp.src([langs[l] + folders[f] + '**/*'])
                .pipe(htmlImport('./templates/' + langs[l]))
                .pipe(removeHtmlComments())
                .pipe(gulp.dest(out + (l === mainLang ? '' : langs[l]) + folders[f]));
        }
    }
    gulp.src(['node_modules/bootstrap/fonts/**/*'])
        .pipe(gulp.dest(out + 'fonts/'));
    gulp.src(['fonts/**/*'])
        .pipe(gulp.dest(out + 'fonts/'));
    gulp.src(['files/**/*'])
        .pipe(gulp.dest(out + 'files/'));
});

gulp.task('img', function() {
    gulp.src(['img/**/*', 'node_modules/jquery-fancybox/source/img/**/*'])
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [
                { removeViewBox: true },
                { cleanupIDs: true }
            ],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(out + 'img/'));
});

gulp.task('publish', function() {
    var conn = ftp.create({
        host: '',
        user: '',
        password: '',
        parallel: 1,
        log: gutil.log
    });
    return gulp.src(['build/**/*'], { base: 'build/', buffer: false })
        .pipe(conn.newer('/bananacoin.io/docs'))
        .pipe(conn.dest('/bananacoin.io/docs'));
});
