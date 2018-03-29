$(document).ready(function () {

    var $anchors = $('a[name][id]');
    var anchors = $anchors.map(function () {
        return $(this).attr('id');
    }).get();
    $(document).on('click', '.nav-link', function (e) {
        var id = false;
        for (var i = 0; i < anchors.length; i++) {
            if ($(this).attr('href').indexOf(anchors[i]) !== -1) {
                id = anchors[i];
                break;
            }
        }
        if (id) {
            e.preventDefault();
            $('html, body').animate({
                scrollTop: $('#' + id).offset().top
            }, 500);
        }
    });

    $(document).on('click', '.updates-expland span', function () {
        $(this).closest('.updates').addClass('expland');
    });

    $('a.popup').fancybox({
        maxWidth: 600
    });

    if ($('.countdown .days').length) {
        var point = $('.countdown').attr('data-point') ? $('.countdown').attr('data-point') : 1503916273;
        var sec = 0;
        var startInterval = setInterval(function () {
            var left = point - Math.round(Date.now() / 1000);
            if (left > 0 && sec < 16) {
                left = seconds_to_data(left);
                $('.countdown .days span').text(left.days.pad());
                $('.countdown .hours span').text(left.hours.pad());
                $('.countdown .minutes span').text(left.minutes.pad());
                $('.countdown .seconds span').text(left.seconds.pad());
                sec = left.seconds;
            } else if (sec > 15) {
                sec--;
                $('.countdown .seconds span').text(sec);
            } else {
                $('.countdown[data-onstart]').each(function () {
                    $(this).text($(this).attr('data-onstart'));
                });
                $('.countdown .row').remove();
                clearInterval(startInterval);
            }
        }, 1000);
    }

    $('*[data-clipboard]').css('cursor', 'pointer');
    $(document).on('click', '*[data-clipboard]', function () {
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val($(this).text()).select();
        document.execCommand("copy");
        $temp.remove();
        alert('Copied to clipboard');
    });

    if ($("#contributed").length) {
        /*var numberWithCommas = function(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }*/
        var get_contributed_in_progress = false;
        var $contributed = $("#contributed");
        var get_contributed = function () {
            if (get_contributed_in_progress === true) {
                return;
            }
            get_contributed_in_progress = true;
            $.get("/get_contributed2").done(function (data) {
                $contributed.html(data);
                get_contributed_in_progress = false;
            })
                .fail(function () {
                    $contributed.html('?');
                    get_contributed_in_progress = false;
                });
        };
        get_contributed();
        //setInterval(get_contributed, 5000);
    }

    var $sliders = $('.team .members, .plantation .info-items, .plantation .slider');
    function runSlider() {
        if ($(window).width() < 768) {
            $sliders.slick({
                dots: true,
                arrows: false,
                infinite: true,
                speed: 300,
                slidesToShow: 1,
                slidesToScroll: 1,
                adaptiveHeight: true
            });
        } else {
            $(".plantation .slider").slick({
                infinite: true,
                adaptiveHeight: true
            });
            //$sliders.slick('unslick');
        }
    }
    var r = setTimeout(runSlider, 500);
    $(window).resize(function () {
        clearTimeout(r);
        r = setTimeout(runSlider, 500);
    });

    if ($('.faq').length) {
        $('.faq').on('click', '.question:not(.active)', function () {
            $('.faq .question.active').removeClass('active');
            $(this).addClass('active');
        });
        $('.faq').on('click', '.question.active .plus', function () {
            $(this).closest('.question').removeClass('active');
        });
    }

    $('.fancybox').fancybox({
        padding: 0
    });

    var numberWithCommas = function (x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    var get_contributed_in_progress = false;
    var $contributed = $("#tokens_sold");
    var get_contributed = function () {
        if (get_contributed_in_progress === true) {
            return;
        }
        get_contributed_in_progress = true;
        $.get("/get_contributed2").done(function (data) {
            $contributed.html(data);
            get_contributed_in_progress = false;
        })
            .fail(function () {
                $contributed.html('?');
                get_contributed_in_progress = false;
            });
    };
    get_contributed();
    setInterval(get_contributed, 5000);
});

function seconds_to_data(s) {
    var r = {};
    r.days = Math.floor(s / 86400);
    r.hours = Math.floor((s - r.days * 86400) / 3600);
    r.minutes = Math.floor((s - r.days * 86400 - r.hours * 3600) / 60);
    r.seconds = s - r.days * 86400 - r.hours * 3600 - r.minutes * 60;
    return r;
}

Number.prototype.pad = function (size) {
    var s = String(this);
    while (s.length < (size || 2)) { s = "0" + s; }
    return s;
}