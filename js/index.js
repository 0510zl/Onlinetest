'use strict';
(function(win, doc, $) {
    var isPc = /macintosh|window/.test(navigator.userAgent.toLowerCase());
    if (isPc) {
        $('body').html('请在手机端查看效果更佳!(∩_∩)');
        return;
    }

    var audio,
        audiobox = $(".palybox");
    document.addEventListener('DOMContentLoaded', function() {
        audio = document.querySelector("#bgaudio");
        // toggleplay(audio, 1);
        // PreLoadHtml();
        document.addEventListener("WeixinJSBridgeReady", function() {
            toggleplay(audio, 1); //背景音乐初始化；
            PreLoadHtml();
        }, false);

    });

    function PreLoadHtml() {
        toggleplay(audio);
        initVoice(); //音效初始化；
        new preLoadImages(['images/g-p.png', 'images/7679.mp3', 'images/g-text.png', 'images/g-b.jpg']).done(function(data) {
            startPage();
        })
    };
    function initVoice() {
        var voicelist = document.querySelectorAll(".voice");
        voicelist.forEach(function(item) {
            item.load();
            //toggleplay(item, 1);
        })
    }

    function toggleplay(obj, voc) {
        voc = voc ? 0 : 1;
        if (obj.paused) {
            if (obj.id === 'bgaudio') {
                audiobox.addClass('rotateall');
            }
            obj.play();
            obj.volume = voc;

        } else {
            if (obj.id === 'bgaudio') {
                audiobox.removeClass('rotateall');
            }
            obj.pause();
        }
    }
    //此属性会被多次触发
    // bgaudio.addEventListener('canplaythrough', function() {
    //        this.pause();

    //        //loading 下载图片
    //    })

    function startPage() {
        $(".loading").remove();
        var weclome = $(".welcome");
        var welpro = weclome.find(".welpeopic");
        var welinfo = weclome.find(".info");
        var intro = $(".intro");
        var countdown = $(".countdown span");
        var count;
        weclome.removeClass("hide");
        addClassName(welpro, "fadein");
        addClassName(welinfo, "fadein", function() {
            // addClassName(welinfo, 'shake', function() {
            // })
        });
        //点击关闭按钮切换到intro 场景
        countdown.parent().tap(function() {
                clearInterval(changecount);
                changintro();
            })
            //倒计时4秒切换到intro 场景
        var changecount = setInterval(function() {
            countdown.parent().removeClass("hide");

            count = parseInt(countdown.html()) - 1;
            if (count == -1) {
                changintro();
                clearInterval(changecount);
            }
            countdown.html(count);

        }, 1000)

        function changintro() {
            weclome.addClass("hide");
            intro.removeClass("hide");
            audiobox.removeClass("hide");
            toggleplay(audio);
            audiobox.tap(function(e) {
                toggleplay(audio)
            });
        }
    }
})(window, document, Zepto)


function addClassName(ele, name, fn) {
    ele.addClass("animated " + name);
    ele.one("webkitAnimationEnd animationend", function() {
        ele.removeClass("animated " + name);
        fn && fn();
    })

}
