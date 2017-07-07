;
(function(win, doc, $, undefind) {
    'use strict'
    var showQues, //Now question number
        preQues, // 上一个问题
        i,
        question,
        _temp_, //sequence   question number
        _temp_1 = "<button class=\"btn-start\">再试一次</button><button class=\"btn-share\">一键分享</button>",
        _temp_2 = "<button class=\"btn-next btn1\">下一步</button>", //
        _temp_3 = "<P class='tip'>智者你好！成功可以有很多种方法，大胆去尝试你的模拟人生吧！</P> ",
        _temp_4 = "<P class='tip'>牛逼！给你一笔启动资金，你就是下一个亿万富翁了！当别人活的不如狗，你却把日子过成了诗~<p>";
    var voiceele;

    function Ceshi(option) {
        var _option = {
            "data": "",
            "contain": ""
        };

        this.option = $.extend({}, _option, option);
        this.init();
        this.render();
        this.eventHandle();
    }
    Ceshi.prototype = {
            init: function() {
                this.income = 3000;
                this.qStart = "q_1_1";
                this.result = new Array();
            },
            render: function() {
                //容器
                this.contain = this.option.contain;
                this.btnStart = this.contain.find(".intro .start_btn");
                this.welcome = this.contain.find(".intro");
                this.question = this.contain.find(".question.next");
                this.msg = this.contain.find(".pop.msg");
                this.chosemsg = this.contain.find(".pop.chosemsg");
                this.deadMask = this.contain.find(".dead_mask");
                this.arrow = this.contain.find(".arrow");
                this.data = this.option.data.data;
                //音频
                this.audioele = $("#bgaudio")[0];
                this.sucvoice = $(".sucaudio")[0];
                this.failvoice = $(".failaudio")[0];
                this.nextvoice = $(".sucaudio")[0];


            },
            eventHandle: function() {
                var _this = this;
                _this.btnStartEvent();

            },
            btnStartEvent: function() {
                i = 1;
                var _this = this;

                _this.btnStart.tap(function(e) {
                    quesOffClick($(this)); //防止多次点击
                    e.preventDefault();
                    new preLoadImages(['images/q-a-b.png', 'images/loser.png', 'images/winner.png', 'images/next.png', 'images/arrow.png']).done(function(data) {
                        _this.welcome.addClass("hide");
                        //第一个问题
                        _this.bindQues();

                    });

                })
            },
            bindQues: function() {

                var _this = this;
                showQues = showQues || _this.qStart;
                //问题绑定内容
                question = toclone();
                ChangeSore.call(_this, _this.income);
                question.find(".title").html("第" + i + "-" + GetQuesNumTo(showQues) + "题");
                question.find(".desmid").html(_this.data[showQues].describe);
                var choices = question.find(".choices");
                choices.empty();
                var j = 0;
                _this.result = [];
                $.each(_this.data[showQues].answers, function(index, item) {
                    var text = "<li class=\"choice\" ><input type=\"radio\" name=" + index + " value=" + index + " ><p>" + item.describe + "</p></li>";
                    choices.append(text);
                    //13题 特例判断
                    if (showQues === 'q_1_13' && preQues === 'q_1_12') {
                        _this.result[j] = [item.result, item.money1, item.next];
                    } else {
                        _this.result[j] = [item.result, item.money, item.next];
                    }
                    j++;
                })

                question.appendTo(this.contain);


                // if (question.hasClass("hide")) {
                question.removeClass("hide");
                // }
                _this.bindQuesEvent(question);
                //根据json题目序列号获得第几题
                function GetQuesNumTo(showQues) {
                    if (showQues != "" && typeof(showQues) == "string") {
                        return parseInt(showQues.split("_").slice(-1));
                    }
                }

                function toclone() {

                    var question = $(".question.next").clone();
                    question.removeClass("next");
                    return question;
                }

                function ChangeSore(money) {
                    this.income = money;
                    question.find(".money").html(this.income / 10000 + "万");
                }

                return true;
            },
            bindQuesEvent: function(question) {
                //绑定点击事件
                var _this = this;
                question.find(".choice").tap(function(e) {
                    e.preventDefault();
                    var _that = this,
                        index = $(_that).index();
                    //取消点击事件
                    var childs = $(_that).siblings();
                    quesOffClick(childs);
                    //清空所有li样式
                    childs.removeClass("active");
                    childs.find("input").removeAttr("checked");
                    //指定li样式添加
                    $(_that).addClass("active");
                    $(_that).find("input").attr("checked", "checked");
                    setTimeout(function() {
                        // console.log("money" + _this.result[index][1]);
                        //改变分值
                        _this.income = _this.result[index][1];
                        //13题 特例判断
                        if (showQues === 'q_1_13' && preQues === 'q_1_12') {
                            preQues = showQues;
                            showQues = 'q_1_15';
                        } else {
                            preQues = showQues;
                            showQues = _this.result[index][2];
                        }
                        // console.log("Ques" + showQues + '-----preQues' + preQues);

                        //根据以后设计可以合并处理
                        var imgurl;
                        var status;

                        if (showQues == "end" || showQues == "" || showQues == "undefined") {
                            // 问答结束绑定结果
                            _temp_ = _temp_1;
                            imgurl = "images/loser.png";
                            voiceele = _this.failvoice;
                            status = showQues;
                            _this.bindResult(index, imgurl, status);
                            showMsg.call(_this, _this.msg);

                        } else if (showQues == "success") {
                            //显示结果
                            _temp_ = _temp_1;
                            imgurl = "images/winner.png";
                            voiceele = _this.sucvoice;
                            status = showQues;
                            _this.bindResult(index, imgurl, status);
                            showMsg.call(_this, _this.msg);
                        } else {

                            //type1 问题分析页面
                            _temp_ = _temp_2;
                            voiceele = _this.nextvoice;
                            _this.bindChooseResult(index);
                            showMsg.call(_this, _this.chosemsg);

                            //type2直接绑定下一题
                            //_this.bindQues(showQues);
                        }
                    }, 400)
                    i++;
                })

                function showMsg(msg) {
                    var _this = this;
                    _this.deadMask.removeClass("hide");
                    msg.removeClass("hide");
                    _this.audioele.volume = 0.2;
                    voiceele.play();
                    voiceele.volume = 1;
                    setTimeout(function() {
                        _this.audioele.volume = 1;
                    }, 5000)
                }
            },
            bindChooseResult: function(index) {
                var _this = this;
                var result = _this.result;
                _this.chosemsg.find(".msgcontent p").html(result[index][0]);
                var btn = _this.chosemsg.find('button');
                if (btn) {
                    btn.remove();
                }
                _this.chosemsg.append(_temp_);
                //绑定此页面按钮事件
                _this.bindResultEvent();
            },
            bindResult: function(index, imgurl, status) {
                var _this = this;
                var result = _this.result;
                _this.msg.find(".msgimg img").attr("src", imgurl);
                _this.msg.find(".msgcontent").html(result[index][0]);
                if (status === "success") {
                    _this.msg.find(".msgcontent").append(_temp_3);
                }
                _this.msg.find(".butlist").html(_temp_);
                //绑定此页面按钮事件
                _this.bindResultEvent();
            },
            bindResultEvent: function() {
                var _this = this;
                if (showQues == "end" || showQues == "success") {
                    $(".btn-start").tap(function(e) {
                            quesOffClick($(this));
                            e.preventDefault();
                            //暂停音效;
                            voiceele.load();
                            reload();
                        })
                        //一键分享按钮
                    $(".btn-share").tap(function(e) {
                        e.preventDefault();
                        //暂停音效;
                        voiceele.load();
                        _this.arrow.removeClass('hide');
                        _this.arrow.tap(function(e) {
                            e.preventDefault();
                            $(this).addClass('hide');
                        })
                    })

                } else {
                    $(".btn-next").tap(function(e) {
                        e.preventDefault();
                        //暂停音效;
                        voiceele.load();
                        hideMsg(_this.chosemsg);
                        //删除当前题目
                        if (question) {
                            question.addClass("hide");
                            question.remove();
                        }
                        _this.bindQues(showQues);
                    })
                }

                function hideMsg(msg) {
                    //显示结果
                    _this.deadMask.addClass("hide");
                    msg.addClass("hide");

                }

            }

        }
        //关闭点击按钮
    function quesOffClick(items) {
        items.off("tap");
    }

    function reload() {

        win.location.href = 'http://' + location.hostname + '' + location.pathname + '?time=' + ((new Date()).getTime());
        return false;
    }


    win.Ceshi = Ceshi;

})(window, document, Zepto)
