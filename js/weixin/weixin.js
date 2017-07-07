$(function() {
    $.ajax({
        url: "./php/weixin.php",
        type: "get",
        success: function(data) {
            var data = JSON.parse(data);
            wx.config({
                debug: false,
                appId: data.appId,
                timestamp: data.timestamp,
                nonceStr: data.nonceStr,
                signature: data.signature,
                jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline']
            });

        },
        error: function(data) {

        }
    })




    wx.ready(function() { //检测api是否生效
        wx.onMenuShareAppMessage({
            title: '模拟人生——人生好比狗生，有时还不如狗', // 分享标题
            desc: '模拟人生——人生好比狗生，有时还不如狗', // 分享描述
            link: 'http://tp.flyfund7.com/zfMytest/jufengbaozipu/', // 分享链接
            imgUrl: 'http://tp.flyfund7.com/zfMytest/jufengbaozipu/images/g-p.png', // 分享图标
            type: 'link', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function() {
                // 用户确认分享后执行的回调函数
            },
            cancel: function() {
                // 用户取消分享后执行的回调函数

            }
        });

        wx.onMenuShareTimeline({
            title: '模拟人生——人生好比狗生，有时还不如狗', // 分享标题
            link: 'http://tp.flyfund7.com/zfMytest/jufengbaozipu/', // 分享链接
            imgUrl: 'http://tp.flyfund7.com/zfMytest/jufengbaozipu/images/g-p.png', // 分享图标
            success: function() {
                // 用户确认分享后执行的回调函数


            },
            cancel: function() {
                // 用户取消分享后执行的回调函数

            }
        });


    })
})
