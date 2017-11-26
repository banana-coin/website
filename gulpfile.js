'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var del = require('del');
var twig = require('gulp-twig');
var removeHtmlComments = require('gulp-remove-html-comments');
var gutil = require('gulp-util');
var ftp = require('vinyl-ftp');

var release = true;

var structure = {
    langs: {
        en: { title: 'En', link: '/' },
        ru: { title: 'Рус', link: '/ru' },
        //cn: { title: '中文', link: '/cn' },
        //kr: { title: '한국어', link: '/kr' },
        //jp: { title: '日本', link: '/jp' }
    },
    nav: {
        en: {
            description: 'World first blockchain option for banana plantation',
            nav: [
                { title: 'Project', url: '/' },
                { title: 'Eco plantation', url: '/plantation/' },
                { title: 'F.A.Q', url: '/faq/' },
                { title: 'Profile', url: '/profile' },
            ],
            socials: [
                '<a href="https://t.me/bananacoineng" onClick="sendEvent(\'ViewContent\')" target="_blank" class="fa fa-telegram"></a>',
                '<a href="/img/qrcode_for_bananacoin_wechat.jpg" target="_blank" class="fa fa-wechat"></a>',
                '<a href="https://twitter.com/Bananacoin_Eng" target="_blank" class="fa fa-twitter"></a>',
                '<a href="https://www.facebook.com/bananacoinENG/" target="_blank" class="fa fa-facebook-f"></a>',
                '<a href="https://www.youtube.com/channel/UCkCZUIafAmqPX0ZnVO0DWdA" target="_blank" class="fa fa-youtube-play"></a>',
                '<a href="https://www.instagram.com/eng_bananacoin.io/" target="_blank" class="fa fa-instagram"></a>'
            ]
        },
        ru: {
            description: 'Первый в мире блокчейн-опцион на производство бананов',
            nav: [
                { title: 'Проект', url: '/ru/' },
                { title: 'Эко плантация', url: '/ru/plantation/' },
                { title: 'F.A.Q', url: '/ru//faq/' },
                { title: 'Профиль', url: '/profile' },
            ],
            socials: [
                '<a href="https://t.me/bananacoin" onClick="sendEvent(\'ViewContent\')" target="_blank" class="fa fa-telegram"></a>',
                '<a href="/img/qrcode_for_bananacoin_wechat.jpg" target="_blank" class="fa fa-wechat"></a>',
                '<a href="https://twitter.com/Bananacoinico" target="_blank" class="fa fa-twitter"></a>',
                '<a href="https://www.facebook.com/bananacoin/" target="_blank" class="fa fa-facebook-f"></a>',
                '<a href="https://www.youtube.com/channel/UCkCZUIafAmqPX0ZnVO0DWdA" target="_blank" class="fa fa-youtube-play"></a>',
                '<a href="https://www.instagram.com/eng_bananacoin.io/" target="_blank" class="fa fa-instagram"></a>'
            ]
        },
        cn: {
            description: '在世界上生产香蕉的第一个区块链期权',
            nav: [
                { title: '项目', url: '/cn/' },
                { title: '种植园', url: '/cn/plantation/' },
                { title: 'Profile', url: '/profile' },
            ],
            socials: [
                '<a href="https://t.me/bananacoineng" onClick="sendEvent(\'ViewContent\')" target="_blank" class="fa fa-telegram"></a>',
                '<a href="/img/qrcode_for_bananacoin_wechat.jpg" target="_blank" class="fa fa-wechat"></a>',
                '<a href="https://twitter.com/Bananacoin_Eng" target="_blank" class="fa fa-twitter"></a>',
                '<a href="https://www.facebook.com/bananacoinENG/" target="_blank" class="fa fa-facebook-f"></a>',
                '<a href="https://www.youtube.com/channel/UCkCZUIafAmqPX0ZnVO0DWdA" target="_blank" class="fa fa-youtube-play"></a>',
            ]
        },
        kr: {
            description: '세계 최초 바나나 농장 블락체인 옵션',
            nav: [
                { title: '프로젝트', url: '/kr' },
                { title: '친환경 농장', url: '/kr/plantation/' },
                { title: 'Profile', url: '/profile' },
            ],
            socials: [
                '<a href="https://t.me/bananacoinkorea" target="_blank" onClick="sendEvent(\'ViewContent\')" class="fa fa-telegram"></a>',
                '<a href="/img/qrcode_for_bananacoin_wechat.jpg" target="_blank" class="fa fa-wechat"></a>',
                '<a href="https://twitter.com/BananaCoinKorea" target="_blank" class="fa fa-twitter"></a>',
                '<a href="https://www.facebook.com/groups/bananacoinkorea/" target="_blank" class="fa fa-facebook-f"></a>',
                '<a href="https://www.youtube.com/channel/UCkCZUIafAmqPX0ZnVO0DWdA" target="_blank" class="fa fa-youtube-play"></a>',
                '<a href="https://www.instagram.com/bananacoin.korea/" target="_blank" class="fa fa-instagram"></a>'
            ]
        },
        jp: {
            description: 'Bananaсoin: クラウドファンディングによる ラオス(ヴィエンチャン都)のバナナ製造拡大',
            nav: [
                { title: 'プロジェクト', url: '/jp/' },
                { title: 'エコ農園', url: '/jp/plantation/' },
                { title: '個人アカウント', url: '/profile' },
            ],
            socials: [
                '<a href="https://t.me/bananacoinjapan" target="_blank" onClick="sendEvent(\'ViewContent\')" class="fa fa-telegram"></a>',
                '<a href="/img/qrcode_for_bananacoin_wechat.jpg" target="_blank" class="fa fa-wechat"></a>',
                '<a href="https://twitter.com/Bananacoin_Eng" target="_blank" class="fa fa-twitter"></a>',
                '<a href="https://www.facebook.com/groups/bananacoinENG/" target="_blank" class="fa fa-facebook-f"></a>',
                '<a href="https://www.youtube.com/channel/UCkCZUIafAmqPX0ZnVO0DWdA" target="_blank" class="fa fa-youtube-play"></a>',
            ]
        }
    }
};

gulp.task('default', ['styles', 'js', 'static', 'img']);

var out = 'build/';

var scripts = [
    'node_modules/jquery/dist/jquery.js',
    'node_modules/popper.js/dist/umd/popper.js',
    'node_modules/tether/dist/js/tether.js',
    'node_modules/bootstrap/dist/js/bootstrap.js',
    'node_modules/slick-carousel/slick/slick.js',
    'node_modules/jquery-fancybox/source/js/jquery.fancybox.js',
    'js/index.js',
];

gulp.task('clean', function() {
    return del([out], { force: true });
});

gulp.task('styles', function() {
    gulp.src(['scss/index.scss'])
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
    var mainLang = 'en';
    for (var lang in structure.langs) {
        var data = structure.nav[lang];
        data.langs = structure.langs;
        data.lang = lang;
        var folders = ['plantation/', 'faq/', 'plan/', 'token/'];
        gulp.src([lang + '/index.html'])
            .pipe(twig({ data: data, base: 'templates/' }))
            .pipe(removeHtmlComments())
            .pipe(gulp.dest(out + (lang === mainLang ? '' : lang + '/')));
        for (var f = 0; f < folders.length; f++) {
            gulp.src([lang + '/' + folders[f] + '**/*'])
                .pipe(twig({ data: data, base: 'templates/' }))
                .pipe(removeHtmlComments())
                .pipe(gulp.dest(out + (lang === mainLang ? '/' : lang + '/') + folders[f]));
        }
    }
    gulp.src(['node_modules/bootstrap/fonts/**/*'])
        .pipe(gulp.dest(out + 'fonts/'));
    gulp.src(['fonts/**/*'])
        .pipe(gulp.dest(out + 'fonts/'));
    gulp.src(['files/**/*'])
        .pipe(gulp.dest(out + 'files/'));
    gulp.src(['subscribe_files/**/*'])
        .pipe(gulp.dest(out + 'subscribe_files/'));
    gulp.src(['success_files/**/*'])
        .pipe(gulp.dest(out + 'success_files/'));
    gulp.src(['pre-ico/**/*'])
        .pipe(gulp.dest(out + 'pre-ico/'));
    gulp.src(['/*.html'])
        .pipe(gulp.dest(out));
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