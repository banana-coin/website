'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var del = require('del');
var twig = require('gulp-twig');
var removeHtmlComments = require('gulp-remove-html-comments');

var news = require('./news.json');
var updates = require('./updates.json');

var release = false;

var structure = {
    langs: {
        en: { title: 'En', link: '/' },
        ru: { title: 'Рус', link: '/ru' },
        es: { title: 'Es', link: '/es' },
        cn: { title: '中文', link: '/cn' },
        fra: { title: 'Fra', link: '/fra' },
        turk: { title: 'Turk', link: '/turk' },
        de: { title: 'De', link: '/de' },
        //kr: { title: '한국어', link: '/kr' },
        jp: { title: '日本', link: '/jp' },
        ind: { title: 'Ind', link: '/ind' },
        pt: { title: 'Pt', link: '/pt' },
        ar: { title: 'العربية', link: '/ar' },
        lao: { title: 'ລາວ', link: '/lao' }
    },
    nav: {
        en: {
            description: 'World first blockchain option for banana plantation',
            nav: [
                { title: 'Project', url: '/' },
                { title: 'Eco plantation', url: '/plantation/' },
                { title: 'FAQ', url: '/faq/' },
                { title: 'Team', url: '/#team' },
                { title: 'Profile', url: '/profile' },
            ],
            socials: [
                '<a href="https://t.me/bananacoineng" onClick="sendEvent(\'ViewContent\')" target="_blank" class="fa fa-telegram"></a>',
                '<a href="https://bitcointalk.org/index.php?topic=2112748" onClick="sendEvent(\'ViewContent\')" target="_blank" class="fa fa-btc"></a>',
                '<a href="/img/qrcode_for_bananacoin_wechat.jpg" target="_blank" class="fa fa-wechat"></a>',
                '<a href="https://twitter.com/Bananacoin_Eng" target="_blank" class="fa fa-twitter"></a>',
                '<a href="https://www.facebook.com/bananacoinENG/" target="_blank" class="fa fa-facebook-f"></a>',
                '<a href="https://www.youtube.com/channel/UCkCZUIafAmqPX0ZnVO0DWdA" target="_blank" class="fa fa-youtube-play"></a>',
                '<a href="https://www.instagram.com/bananacoin_io/" target="_blank" class="fa fa-instagram"></a>',
                '<a href="https://open.kakao.com/o/gRtuHrz" target="_blank" onClick="sendEvent(\'ViewContent\')" class="kakao"></a>'
            ]
        },
        turk: {
            description: 'World first blockchain option for banana plantation',
            nav: [
                { title: 'Proje', url: '/' },
                { title: 'Ekolojik Plantasyon', url: '/plantation/' },
                { title: 'S.S.S', url: '/faq/' },
                { title: 'Ekip', url: '/turk/#team' },
                { title: 'Profil', url: '/profile' },
            ],
            socials: [
                '<a href="https://t.me/bananacoin_tur" onClick="sendEvent(\'ViewContent\')" target="_blank" class="fa fa-telegram"></a>',
                '<a href="https://bitcointalk.org/index.php?topic=2112748" onClick="sendEvent(\'ViewContent\')" target="_blank" class="fa fa-btc"></a>',
                '<a href="/img/qrcode_for_bananacoin_wechat.jpg" target="_blank" class="fa fa-wechat"></a>',
                '<a href="https://twitter.com/Bananacoin_Eng" target="_blank" class="fa fa-twitter"></a>',
                '<a href="https://www.facebook.com/bananacoinENG/" target="_blank" class="fa fa-facebook-f"></a>',
                '<a href="https://www.youtube.com/channel/UCkCZUIafAmqPX0ZnVO0DWdA" target="_blank" class="fa fa-youtube-play"></a>',
                '<a href="https://www.instagram.com/bananacoin_io/" target="_blank" class="fa fa-instagram"></a>',
                '<a href="https://open.kakao.com/o/gRtuHrz" target="_blank" onClick="sendEvent(\'ViewContent\')" class="kakao"></a>'
            ]
        },
        de: {
            description: 'Die erste umweltfreundliche Plantage in Laos mit einem Ether Token, dessen Preis an 1kg Bananen gebunden ist',
            nav: [
                { title: 'Projekt', url: '/' },
                { title: 'Öko-Plantage', url: '/plantation/' },
                { title: 'FAQ', url: '/faq/' },
                { title: 'Mannschaft', url: '/de/#team' },
                { title: 'Profil', url: '/profile' },
            ],
            socials: [
                '<a href="https://telegram.me/bananacoin_germ" onClick="sendEvent(\'ViewContent\')" target="_blank" class="fa fa-telegram"></a>',
                '<a href="https://bitcointalk.org/index.php?topic=2112748" onClick="sendEvent(\'ViewContent\')" target="_blank" class="fa fa-btc"></a>',
                '<a href="/img/qrcode_for_bananacoin_wechat.jpg" target="_blank" class="fa fa-wechat"></a>',
                '<a href="https://twitter.com/Bananacoin_Eng" target="_blank" class="fa fa-twitter"></a>',
                '<a href="https://www.facebook.com/bananacoinENG/" target="_blank" class="fa fa-facebook-f"></a>',
                '<a href="https://www.youtube.com/channel/UCkCZUIafAmqPX0ZnVO0DWdA" target="_blank" class="fa fa-youtube-play"></a>',
                '<a href="https://www.instagram.com/bananacoin_io/" target="_blank" class="fa fa-instagram"></a>',
                '<a href="https://open.kakao.com/o/gRtuHrz" target="_blank" onClick="sendEvent(\'ViewContent\')" class="kakao"></a>'
            ]
        },
        jp: {
            description: 'ラオス初の環境保全型プランテーションはすでにEthereumで実用トークンを発行しました。1キログラムのバナナの輸出価格と関連付けています。',
            nav: [
                { title: 'Project', url: '/' },
                { title: 'Eco plantation', url: '/plantation/' },
                { title: 'FAQ', url: '/faq/' },
                { title: 'Team', url: '/jp/#team' },
                { title: '個人情報', url: '/profile' },
            ],
            socials: [
                '<a href="https://t.me/bananacoinjapan" onClick="sendEvent(\'ViewContent\')" target="_blank" class="fa fa-telegram"></a>',
                '<a href="https://bitcointalk.org/index.php?topic=2112748" onClick="sendEvent(\'ViewContent\')" target="_blank" class="fa fa-btc"></a>',
                '<a href="/img/qrcode_for_bananacoin_wechat.jpg" target="_blank" class="fa fa-wechat"></a>',
                '<a href="https://twitter.com/Bananacoin_Eng" target="_blank" class="fa fa-twitter"></a>',
                '<a href="https://www.facebook.com/bananacoinENG/" target="_blank" class="fa fa-facebook-f"></a>',
                '<a href="https://www.youtube.com/channel/UCkCZUIafAmqPX0ZnVO0DWdA" target="_blank" class="fa fa-youtube-play"></a>',
                '<a href="https://www.instagram.com/bananacoin_io/" target="_blank" class="fa fa-instagram"></a>',
                '<a href="https://open.kakao.com/o/gRtuHrz" target="_blank" onClick="sendEvent(\'ViewContent\')" class="kakao"></a>'
            ]
        },
        cn: {
            description: '老挝首个环保种植园已经在Ethereum发行了实用代币，与1公斤香蕉的出口价格挂钩。',
            nav: [
                { title: '项目', url: '/' },
                { title: '生态种植园', url: '/plantation/' },
                { title: '常问问题', url: '/faq/' },
                { title: '团队', url: '/cn/#team' },
                { title: '简介', url: '/profile' },
            ],
            socials: [
                '<a href="https://t.me/bananacoin_ch" onClick="sendEvent(\'ViewContent\')" target="_blank" class="fa fa-telegram"></a>',
                '<a href="https://bitcointalk.org/index.php?topic=2112748" onClick="sendEvent(\'ViewContent\')" target="_blank" class="fa fa-btc"></a>',
                '<a href="/img/qrcode_for_bananacoin_wechat.jpg" target="_blank" class="fa fa-wechat"></a>',
                '<a href="https://twitter.com/Bananacoin_Eng" target="_blank" class="fa fa-twitter"></a>',
                '<a href="https://www.facebook.com/bananacoinENG/" target="_blank" class="fa fa-facebook-f"></a>',
                '<a href="https://www.youtube.com/channel/UCkCZUIafAmqPX0ZnVO0DWdA" target="_blank" class="fa fa-youtube-play"></a>',
                '<a href="https://www.instagram.com/bananacoin_io/" target="_blank" class="fa fa-instagram"></a>',
                '<a href="https://open.kakao.com/o/gRtuHrz" target="_blank" onClick="sendEvent(\'ViewContent\')" class="kakao"></a>'
            ]
        },
        fra: {
            description: 'La première plantation respectueuse de lenvironnement au Laos a lancé un token basé sur Ethereum, corrélé au prix à lexportation d un 1 kg de bananes.',
            nav: [
                { title: 'Projet', url: '/' },
                { title: 'Eco Plantation', url: '/plantation/' },
                { title: 'FAQ', url: '/faq/' },
                { title: 'Equipe', url: '/fra/#team' },
                { title: 'Profil', url: '/profile' },
            ],
            socials: [
                '<a href="https://t.me/bananacoin_fr" onClick="sendEvent(\'ViewContent\')" target="_blank" class="fa fa-telegram"></a>',
                '<a href="https://bitcointalk.org/index.php?topic=2112748" onClick="sendEvent(\'ViewContent\')" target="_blank" class="fa fa-btc"></a>',
                '<a href="/img/qrcode_for_bananacoin_wechat.jpg" target="_blank" class="fa fa-wechat"></a>',
                '<a href="https://twitter.com/Bananacoin_Eng" target="_blank" class="fa fa-twitter"></a>',
                '<a href="https://www.facebook.com/bananacoinENG/" target="_blank" class="fa fa-facebook-f"></a>',
                '<a href="https://www.youtube.com/channel/UCkCZUIafAmqPX0ZnVO0DWdA" target="_blank" class="fa fa-youtube-play"></a>',
                '<a href="https://www.instagram.com/bananacoin_io/" target="_blank" class="fa fa-instagram"></a>',
                '<a href="https://open.kakao.com/o/gRtuHrz" target="_blank" onClick="sendEvent(\'ViewContent\')" class="kakao"></a>'
            ]
        },
        ru: {
            description: 'Первый в мире блокчейн-опцион на производство бананов',
            nav: [
                { title: 'Проект', url: '/ru/' },
                { title: 'Эко-плантация', url: '/ru/plantation/' },
                { title: 'FAQ', url: '/ru/faq/' },
                { title: 'Команда', url: '/ru/#team' },
                { title: 'Профиль', url: '/profile' },
            ],
            socials: [
                '<a href="https://t.me/bananacoin" onClick="sendEvent(\'ViewContent\')" target="_blank" class="fa fa-telegram"></a>',
                '<a href="https://bitcointalk.org/index.php?topic=2251339" onClick="sendEvent(\'ViewContent\')" target="_blank" class="fa fa-btc"></a>',
                '<a href="/img/qrcode_for_bananacoin_wechat.jpg" target="_blank" class="fa fa-wechat"></a>',
                '<a href="https://twitter.com/Bananacoin_Eng" target="_blank" class="fa fa-twitter"></a>',
                '<a href="https://www.facebook.com/BananacoinRUSSLANG/" target="_blank" class="fa fa-facebook-f"></a>',
                '<a href="https://www.youtube.com/channel/UCkCZUIafAmqPX0ZnVO0DWdA" target="_blank" class="fa fa-youtube-play"></a>',
                '<a href="https://www.instagram.com/bananacoin_rus/" target="_blank" class="fa fa-instagram"></a>'
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
                '<a href="https://open.kakao.com/o/gRtuHrz" target="_blank" onClick="sendEvent(\'ViewContent\')" class="kakao"></a>',
                '<a href="https://t.me/bananacoinkorea" target="_blank" onClick="sendEvent(\'ViewContent\')" class="fa fa-telegram"></a>',
                '<a href="https://bitcointalk.org/index.php?topic=2112748" onClick="sendEvent(\'ViewContent\')" target="_blank" class="fa fa-btc"></a>',
                '<a href="/img/qrcode_for_bananacoin_wechat.jpg" target="_blank" class="fa fa-wechat"></a>',
                '<a href="https://twitter.com/BananaCoinKorea" target="_blank" class="fa fa-twitter"></a>',
                '<a href="https://www.facebook.com/groups/bananacoinkorea/" target="_blank" class="fa fa-facebook-f"></a>',
                '<a href="https://www.youtube.com/channel/UCkCZUIafAmqPX0ZnVO0DWdA" target="_blank" class="fa fa-youtube-play"></a>',
                '<a href="https://www.instagram.com/bananacoin_io/" target="_blank" class="fa fa-instagram"></a>'
            ]
        },
        es: {
            description: 'World first blockchain option for banana plantation',
            nav: [
                { title: 'Proyecto', url: '/es/' },
                { title: 'Eco Plantación', url: '/es/plantation/' },
                { title: 'Preguntas', url: '/es/faq/' },
                { title: 'Equipo', url: '/es/#team' },
                { title: 'Acceso', url: '/profile' },
            ],
            socials: [
                '<a href="https://t.me/bananacoin_sp" onClick="sendEvent(\'ViewContent\')" target="_blank" class="fa fa-telegram"></a>',
                '<a href="https://bitcointalk.org/index.php?topic=2112748" onClick="sendEvent(\'ViewContent\')" target="_blank" class="fa fa-btc"></a>',
                '<a href="/img/qrcode_for_bananacoin_wechat.jpg" target="_blank" class="fa fa-wechat"></a>',
                '<a href="https://twitter.com/Bananacoin_Eng" target="_blank" class="fa fa-twitter"></a>',
                '<a href="https://www.facebook.com/bananacoinENG/" target="_blank" class="fa fa-facebook-f"></a>',
                '<a href="https://www.youtube.com/channel/UCkCZUIafAmqPX0ZnVO0DWdA" target="_blank" class="fa fa-youtube-play"></a>',
                '<a href="https://www.instagram.com/bananacoin_io/" target="_blank" class="fa fa-instagram"></a>'
            ]
        },
        ind: {
            description: 'World first blockchain option for banana plantation',
            nav: [
                { title: 'Proyek', url: '/ind' },
                { title: 'Perkebunan Eco', url: '/ind/plantation/' },
                { title: 'FAQ', url: '/ind/faq/' },
                { title: 'Tim', url: '/ind/#team' },
                { title: 'Profil', url: '/profile' },
            ],
            socials: [
                '<a href="https://t.me/bananacoineng" onClick="sendEvent(\'ViewContent\')" target="_blank" class="fa fa-telegram"></a>',
                '<a href="https://bitcointalk.org/index.php?topic=2112748" onClick="sendEvent(\'ViewContent\')" target="_blank" class="fa fa-btc"></a>',
                '<a href="/img/qrcode_for_bananacoin_wechat.jpg" target="_blank" class="fa fa-wechat"></a>',
                '<a href="https://twitter.com/Bananacoin_Eng" target="_blank" class="fa fa-twitter"></a>',
                '<a href="https://www.facebook.com/bananacoinENG/" target="_blank" class="fa fa-facebook-f"></a>',
                '<a href="https://www.youtube.com/channel/UCkCZUIafAmqPX0ZnVO0DWdA" target="_blank" class="fa fa-youtube-play"></a>',
                '<a href="https://www.instagram.com/bananacoin_io/" target="_blank" class="fa fa-instagram"></a>',
                '<a href="https://open.kakao.com/o/gRtuHrz" target="_blank" onClick="sendEvent(\'ViewContent\')" class="kakao"></a>'
            ]
        },
        pt: {
            description: 'World first blockchain option for banana plantation',
            nav: [
                { title: 'Projeto', url: '/pt' },
                { title: 'Plantação Ecológica', url: '/pt/plantation/' },
                { title: 'Perguntas', url: '/pt/faq/' },
                { title: 'Equipe', url: '/pt/#team' },
                { title: 'Acesso', url: '/profile' },
            ],
            socials: [
                '<a href="https://t.me/bananacoineng" onClick="sendEvent(\'ViewContent\')" target="_blank" class="fa fa-telegram"></a>',
                '<a href="https://bitcointalk.org/index.php?topic=2112748" onClick="sendEvent(\'ViewContent\')" target="_blank" class="fa fa-btc"></a>',
                '<a href="/img/qrcode_for_bananacoin_wechat.jpg" target="_blank" class="fa fa-wechat"></a>',
                '<a href="https://twitter.com/Bananacoin_Eng" target="_blank" class="fa fa-twitter"></a>',
                '<a href="https://www.facebook.com/bananacoinENG/" target="_blank" class="fa fa-facebook-f"></a>',
                '<a href="https://www.youtube.com/channel/UCkCZUIafAmqPX0ZnVO0DWdA" target="_blank" class="fa fa-youtube-play"></a>',
                '<a href="https://www.instagram.com/bananacoin_io/" target="_blank" class="fa fa-instagram"></a>',
                '<a href="https://open.kakao.com/o/gRtuHrz" target="_blank" onClick="sendEvent(\'ViewContent\')" class="kakao"></a>'
            ]
        },
        ar: {
            description: 'World first blockchain option for banana plantation',
            nav: [
                { title: 'المشروع', url: '/ar' },
                { title: 'بيئة المزارع', url: '/ar/plantation/' },
                { title: 'الاسئلة الشائعة', url: '/ar/faq/' },
                { title: 'الفريق', url: '/ar/#team' },
                { title: 'الملف الشخصي', url: '/profile' },
            ],
            socials: [
                '<a href="https://t.me/bananacoineng" onClick="sendEvent(\'ViewContent\')" target="_blank" class="fa fa-telegram"></a>',
                '<a href="https://bitcointalk.org/index.php?topic=2112748" onClick="sendEvent(\'ViewContent\')" target="_blank" class="fa fa-btc"></a>',
                '<a href="/img/qrcode_for_bananacoin_wechat.jpg" target="_blank" class="fa fa-wechat"></a>',
                '<a href="https://twitter.com/Bananacoin_Eng" target="_blank" class="fa fa-twitter"></a>',
                '<a href="https://www.facebook.com/bananacoinENG/" target="_blank" class="fa fa-facebook-f"></a>',
                '<a href="https://www.youtube.com/channel/UCkCZUIafAmqPX0ZnVO0DWdA" target="_blank" class="fa fa-youtube-play"></a>',
                '<a href="https://www.instagram.com/bananacoin_io/" target="_blank" class="fa fa-instagram"></a>',
                '<a href="https://open.kakao.com/o/gRtuHrz" target="_blank" onClick="sendEvent(\'ViewContent\')" class="kakao"></a>'
            ]
        },
        lao: {
            description: 'World first blockchain option for banana plantation',
            nav: [
                { title: 'ໂຄງການ', url: '/lao' },
                { title: 'ການປູກຝັງ', url: '/lao/plantation/' },
                { title: 'ຄຳຖາມທີ່ມັກພົບເລື້ອຍໆ', url: '/lao/faq/' },
                { title: 'ທິມງານ', url: '/lao/#team' },
                { title: 'ໂປຣໄຟ', url: '/profile' },
            ],
            socials: [
                '<a href="https://T.me/Bananacoin_LAO" onClick="sendEvent(\'ViewContent\')" target="_blank" class="fa fa-telegram"></a>',
                '<a href="https://bitcointalk.org/index.php?topic=2112748" onClick="sendEvent(\'ViewContent\')" target="_blank" class="fa fa-btc"></a>',
                '<a href="/img/qrcode_for_bananacoin_wechat.jpg" target="_blank" class="fa fa-wechat"></a>',
                '<a href="https://twitter.com/Bananacoin_Eng" target="_blank" class="fa fa-twitter"></a>',
                '<a href="https://www.facebook.com/bananacoinENG/" target="_blank" class="fa fa-facebook-f"></a>',
                '<a href="https://www.youtube.com/channel/UCkCZUIafAmqPX0ZnVO0DWdA" target="_blank" class="fa fa-youtube-play"></a>',
                '<a href="https://www.instagram.com/bananacoin_io/" target="_blank" class="fa fa-instagram"></a>',
                '<a href="https://open.kakao.com/o/gRtuHrz" target="_blank" onClick="sendEvent(\'ViewContent\')" class="kakao"></a>'
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
        data.news = news[lang];
        data.updates = updates[lang];
        if (!data.updates) {
            data.updates = updates['en'];
        }
        data.price = { banana: '2.3', mango: '2.1' };
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
    gulp.src(['*.html'])
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