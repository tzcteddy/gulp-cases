/**
 * Created by YYBJ on 2018/7/17.
 */
(function (window, undefined) {
    window.MHL = function () {
        var version="0.0.1";
        var URL = {
                openUrl: 'https://www.menghunli.com/download',//ios打开app
                WeixinUrl: 'http://android.myapp.com/myapp/detail.htm?apkName=com.dream.wedding',
                downAndroidUrl: 'https://product-uploadtoapps.oss-cn-beijing.aliyuncs.com/app_update/hqApp-700002-release.apk',//安卓下载
                downIosUrl: 'itms-apps://itunes.apple.com/app/id1304807209'//ios下载
            },
            BrowserInfo = {
                isAndroid: Boolean(navigator.userAgent.toLowerCase().match(/android/ig)),
                isIphone: Boolean(navigator.userAgent.toLowerCase().match(/iphone|ipod/ig)),
                isIpad: Boolean(navigator.userAgent.toLowerCase().match(/ipad/ig)),
                isWeixin: Boolean(navigator.userAgent.toLowerCase().match(/micromessenger/ig))
            },

            callBack = function (opened) {
                if (opened == 1) {//打开了app

                } else {//没打开去下载
                    if (BrowserInfo.isWeixin) {//在微信上
                        window.location.href = URL.WeixinUrl;
                    } else if (BrowserInfo.isIphone || BrowserInfo.isIpad) {//在ios上
                        window.location = URL.downIosUrl;
                    } else {//其他浏览器中
                        window.location = URL.downAndroidUrl;
                    }
                }
            },
            openOrDown = function (openUrl, callback, canClick) {
                //检查app是否打开
                function checkOpen(cb) {
                    var _clickTime = +(new Date());

                    function check(elsTime) {
                        if (elsTime > 3000 || document.hidden || document.webkitHidden) {
                            cb(1);
                        } else {
                            cb(0);
                        }
                    }

                    //启动间隔20ms运行的定时器，并检测累计消耗时间是否超过3000ms，超过则结束
                    var _count = 0, intHandle;
                    intHandle = setInterval(function () {
                        _count++;
                        var elsTime = +(new Date()) - _clickTime;
                        if (_count >= 100 || elsTime > 3000) {
                            clearInterval(intHandle);
                            check(elsTime);
                        }
                    }, 20);
                }

                //在iframe 中打开APP
                var ifr = document.createElement('iframe');
                if (BrowserInfo.isIphone || BrowserInfo.isIpad) {
                    location.href = openUrl;
                } else {
                    ifr.src = openUrl;
                }
                ifr.style.display = 'none';
                if (callback) {
                    //客户端检测微信直接跳应用宝链接
                    //使用微链接
                    var encodeUri = encodeURIComponent(openUrl);

                    if (BrowserInfo.isWeixin) {
                        //window.location.href = '微链url&android_schema='+encodeUri;
                        BrowserInfo.isIphone || BrowserInfo.isIpad
                            ? window.location.href = URL.downIosUrl
                            : window.location.href = URL.WeixinUrl;
                    } else {
                        checkOpen(function (opened) {
                            callback && callback(opened);
                        });
                    }
                }
                document.body.appendChild(ifr);
                setTimeout(function () {
                    document.body.removeChild(ifr);
                }, 2000);

            },
            openAppFromWeb = function (open_url) {
                openOrDown(open_url, callBack);
            },
            initMainInfo = function () {
                var _this = this;
                var phone = null, token = null;
                var user, isApp;
                user = localStorage.getItem("user_info");
                if (user) {
                    user = JSON.parse(user);
                    phone = user.phone;
                    token = user.token;
                }
                /* user={
                 phone:"15727395536",
                 token:"eyJ0eXAiOiJKV1MiLCJhbGciOiJIUzI1NiJ9.eyJleHBpcmVUaW1lIjoxNTI5MDU3MTQyNTM5LCJ1c2VyUm9sZSI6MiwidXNlcklkIjo0NDk4MH0.cyl2HpFXJMvGKIuLy8uicd4h3EOsMhzwOJOZIyeR7wQ",
                 nickName:"下雨吧"
                 };*/
                if (BrowserInfo.isAndroid) {
                    isApp = window.android ? true : false;
                } else if (BrowserInfo.isIphone || BrowserInfo.isIpad) {
                    isApp = user && user != '' ? true : false;
                }
                return {
                    isApp:isApp,
                    isToken:(token) && (token != '') ? true : false,
                    user: user
                }
            },
            /**
             * @param {string} ele
             * @param {string} type
             * @param {function array} fn
             */
            bindEvent = function (ele, type, fn) {
                var _this = this;
                if (typeof ele == 'string') {
                    $(ele).on(type, function (e) {
                        if (Object.prototype.toString.call(fn) == '[object Function]') {
                            fn.call(_this, e, this);
                        }
                        if (Object.prototype.toString.call(fn) == '[object Array]') {
                            for (var i = 0; i < fn.length; i++) {
                                fn[i].call(_this, e, this);
                            }
                        }
                    })
                }
            },
            /**
             * @param {string} ele
             * @param {string} type
             */
            offEvent = function (ele, type) {
                var _this = this;
                if (typeof ele == 'string') {
                    if (typeof type == "string") {
                        $(ele).off(type)
                    }
                    if (Object.prototype.toString.call(type) == '[object Array]') {
                        for (var i = 0; i < type.length; i++) {
                            $(ele).off(type[i]);
                        }
                    }
                }
            },
            //展示工具函数
            show = function (eles, flag) {
                var _this = this;
                if (typeof eles == 'string') {
                    flag ? $(eles).show() : $(eles).hide();
                }
                if (Object.prototype.toString.call(eles) == '[object Array]') {
                    for (var i = 0; i < eles.length; i++) {
                        flag ? $(eles[i]).show() : $(eles[i]).hide();
                    }
                }
            },
            /**
             * @param {string} url
             * @param {string} method
             * @param {object} data
             * @param {function} callback
             */
            getData = function (url, method, data, callback) {
                var _this = this;
                $.ajax({
                    headers: {
                        "Content-Type": "application/json;charset=UTF-8"
                    },
                    url:  url,
                    type: method,
                    data: data,
                    dataType: 'json',
                    success: function (result) {
                        callback(result);
                    }
                })
            };
        var NativeFn = function () {
            this.openUrl = {
                androidUrl: "yuanbo.mobileapp://dreamweddingApp/openApp",
                IOSUrl: "https://www.menghunli.com/download"
            };

            this.isAndroid = BrowserInfo.isAndroid;
            this.isIOS = BrowserInfo.isIpad || BrowserInfo.isIphone;
            this.isApp = initMainInfo().isApp;
            this.isToken = initMainInfo().isToken;
            this.user = initMainInfo().user;
        };
        NativeFn.prototype = {
            constructor: NativeFn,
            /**启动APP
             * @param */
            openAPP: function (options) {
                var _this = this;
                var andriodUrl=(options&&options.android)||_this.openUrl.androidUrl;
                var iosUrl=(options&&options.ios)||"https://www.menghunli.com/download";
                if (_this.isAndroid) {
                    openAppFromWeb(andriodUrl);
                    return;
                }
                if (_this.isIOS) {
                    openAppFromWeb(iosUrl);
                    return
                }
            },

            /**APP内跳到商家详情页
             * @param Object
             *   category_first_id:int
             *   seller_id:int*/
            toSellerDetail: function (obj) {
                var _this = this;
                if (_this.isAndroid) {
                    _this.isApp && window.android && window.android.jsPushSellerDetail(JSON.stringify(obj));
                    return;
                }
                if (_this.isIOS) {
                    _this.isApp && window.webkit && window.webkit.messageHandlers.jsPushSellerDetail.postMessage(obj);
                    return;
                }
            },

            /**APP内跳到文章（案例、作品等）详情页
             * @param Object
             * category:文章的category类型
             * article_id:文章id
             * */
            toArticleDetail: function (obj) {
                var _this = this;
                if (_this.isIOS) {
                    _this.isApp && window.webkit && window.webkit.messageHandlers.jsPushArticleDetail.postMessage(obj);
                    return;
                }
                if (_this.isAndroid) {
                    _this.isApp && window.android && window.android.jsPushArticleDetail(JSON.stringify(obj));
                    return;
                }
            },
            /**
             * @param Object
             *category_first_id:商家一级类别， 用来区分是否是场地
             * seller_id: 商家 ID
             * pageType: 0, # 0-主页 ， 1-案例 ， 2-套餐 ， 3-日记
             * */
            toSiteDetail: function (obj) {
                var _this = this;
                if (_this.isIOS) {
                    _this.isApp && window.webkit && window.webkit.messageHandlers.jsPushSellerDetail.postMessage(obj);
                    return;
                }
                if (_this.isAndroid) {
                    _this.isApp && window.android && window.android.jsPushSellerDetail(JSON.stringify(obj));
                    return;
                }
            },
            /**跳到日记发布页
             * @param Object
             * articleId:0*/
            toEditDiary:function(obj){
                var _this = this;
                if (_this.isIOS) {
                    _this.isApp && window.webkit && window.webkit.messageHandlers.jsPushPublishDiary.postMessage(obj);
                    return;
                }
                if (_this.isAndroid) {
                    _this.isApp && window.android && window.android.jsPushPublishDiary(JSON.stringify(obj));
                    return;
                }
            },
            /**APP内调用电话
             * @param Object
             *   phone:string*/
            toCallPhone: function (obj) {
                var _this = this;
                if (_this.isIOS) {
                    _this.isApp && window.webkit && window.webkit.messageHandlers.jsCallPhone.postMessage(obj);
                    return;
                }
                if (_this.isAndroid) {
                    _this.isApp && window.android && window.android.jsCallPhone(JSON.stringify(obj));
                    return;
                }
            },
            /**APP内调用登陆
             * @param Object*/
            toLogin: function (user) {
                var _this = this;
                if (_this.isAndroid) {
                    _this.isApp && window.android && window.android.jsObtainUserInfo(JSON.stringify(user));
                    return;
                }
                if (_this.isIOS) {
                    _this.isApp && window.webkit && window.webkit.messageHandlers.jsObtainUserInfo.postMessage(user);
                    return;
                }

            },
            /**APP内调用私信商家
             * @param Object
             * userId:商家user_id
             * */
            privateLetterSeller: function (obj) {
                var _this = this;
                if (_this.isIOS) {
                    _this.isApp && window.webkit && window.webkit.messageHandlers.jsPrivateLetterSeller.postMessage(obj);
                    return;
                }
                if (_this.isAndroid) {
                    _this.isApp && window.android && window.android.jsPrivateLetterSeller(JSON.stringify(obj));
                    return;
                }
            },
            /**商家活动—参与活动
             * @param Object
             * seller_id:商家id
             * activity_id:活动id
             * */
            joinSellerActive: function (obj) {
                var _this = this;
                if (_this.isIOS) {
                    _this.isApp && window.webkit && window.webkit.messageHandlers.jsAppointSeller.postMessage(obj);
                    return;
                }
                if (_this.isAndroid) {
                    _this.isApp && window.android && window.android.jsAppointSeller(JSON.stringify(obj));
                    return;
                }
            },
            /**打开app某页
             * @param Object
             * schemeUrl:跳转url
             * */
            openAppPage: function (obj) {
                var _this = this;
                if (_this.isIOS) {
                    _this.isApp && window.webkit && window.webkit.messageHandlers.jsOpenAppPage.postMessage(obj);
                    return;
                }
                if (_this.isAndroid) {
                    _this.isApp && window.android && window.android.jsOpenAppPage(JSON.stringify(obj));
                    return;
                }
            },
            /**统计
             * @param event_name[string]
             * @param event_value[object]*/
            countAll: function (event_name, event_value) {
                var _this = this;
                var obj = {
                    "event_name": event_name,
                    "event_value": event_value
                };
                console.table(obj);
                if (_this.isIOS) {
                    _this.isApp && window.webkit && window.webkit.messageHandlers.jsEventInfo.postMessage(obj);
                    return;
                }
                if (_this.isAndroid) {
                    _this.isApp && window.android && window.android.jsEventInfo(JSON.stringify(obj));
                    return;
                }
            },
            giveHeight: function (obj) {
                var _this = this;
                if (_this.isIOS) {
                    _this.isApp && window.webkit && window.webkit.messageHandlers.jsAppObtainWebViewHeight.postMessage(obj);
                    return;
                }

            },
            backPage: function () {
                var _this = this;
                if (_this.isAndroid) {
                    _this.isApp && window.android && window.android.jsBackToPreviousPage();
                    return;
                }
                if (_this.isIphone || _this.isIpad) {
                    _this.isApp && window.webkit && window.webkit.messageHandlers.jsBackToPreviousPage.postMessage({});
                    return;
                }
            }
        };
        var AlertPop = function (options) {
            this.msg = options.message;
            this.timer=options.timer||800;
            this.isReload = options.isReload || false;
            this.alertStr = '';
            this.appendAlert();
        };
        AlertPop.prototype = {
            constructor: AlertPop,
            createEle: function () {
                var _this = this;
                _this.alertStr += '<div class="alert-pop">';
                _this.alertStr += '<div class="alert-mask"></div>';
                _this.alertStr += '<div class="alert-msg">';
                _this.alertStr += '<span class="alert-text">' + this.msg + '</span>';
                _this.alertStr += '</div>';
                _this.alertStr += '</div>';
            },
            appendAlert: function () {
                var _this = this;
                _this.createEle();
                $("body").append(_this.alertStr);
                _this.close();
            },
            close: function () {
                var _this = this;
                if($(".alert-pop").fadeOut){
                    $(".alert-pop").fadeOut(_this.timer,function(){
                        $(".alert-pop").remove();
                        if (_this.isReload) {
                            window.location.reload()
                        }
                    })
                    return
                }
                setTimeout(function () {
                    $(".alert-pop").remove();
                    if (_this.isReload) {
                        window.location.reload()
                    }
                }, _this.timer)

            }
        };
        var ImageCenter = function () {
            this.lazyLoad();
        };
        ImageCenter.prototype = {
            constructor: ImageCenter,
            lazyLoad: function () {
                var _this = this;
                var $images = $('img.lazy');
                $images.lazyload({
                    effect: "fadeIn",
                    /*threshold: 200,*/
                    effectspeed: 200,
                })
                for (var i = 0; i < $images.length; i++) {
                    _this.imgLoadPosition($images[i])
                }
            },
            imgLoad: function (img, callBack) {
                var tempImag = new Image
                    , e = $(img).attr("src")
                    , n = $(img).attr("data-original");
                e == n ? tempImag.src = img.src : (tempImag.src = n || e,
                    $(img).hide(),
                    $(img).fadeIn(300)),
                    tempImag.onload = function () {
                        $(img).attr("src", n),
                            callBack(img, tempImag)
                    }
            },
            imgLoadPosition: function (a) {
                var i = this;
                i.imgLoad(a, function (a, i) {
                    var t = i.width
                        , e = i.height
                        , n = $(a).parent().width()
                        , s = $(a).parent().height()
                        , o = n / s
                        , l = t / e;
                    if (o < l) {
                        var c = s * l
                            , r = (c - n) / 2;
                        $(a).removeAttr("width"),
                            $(a).css({
                                position: "absolute",
                                top: 0,
                                height: s + "px",
                                left: -r + "px",
                                width: "auto"
                            })
                    } else {
                        var c = s * l
                            , r = (c - n) / 2
                            , d = n / l
                            , h = (d - s) / 2;
                        $(a).css({
                            position: "absolute",
                            top: -h + "px",
                            height: "auto",
                            left: 0,
                            width: "100%"
                        })
                    }
                })
            }
        };
        var ScrollSwitch = function () {
            if ($(".nav").length) {
                this.navOffsetTop = $(".nav").offset().top;
            }
        };
        ScrollSwitch.prototype = {
            constructor: ScrollSwitch,
            /**
             * @param:e 事件
             * @param:ele 事件元素(切换元素)
             * @param:type type:true时切换卡片
             * */
            switch: function (e, ele, type) {
                var actionAry = [$(".switch .active")];
                actionAry.pop().removeClass("active");
                $(ele).addClass("active");
                if (type) {
                    var ctrlContent = [$("main .show")];
                    ctrlContent.pop().removeClass("show");
                    $("." + $(ele).attr("switch-ctrl")).addClass("show");
                } else {
                    return;
                }
            },
            /*判断是否支持position:sticky*/
            isSticky: function () {
                var nav = document.getElementsByClassName("nav")[0];
                return /sticky/i.test(window.getComputedStyle(nav).position);
            },
            /*返回滚动到第几个模块*/
            scrollSwitch: function () {
                var _this = this;
                var indexFlag;
                $("section").each(function (index, item) {
                    if (($(item).height() + $(item).offset().top >= $(window).scrollTop() + $(window).height()) && ($(item).offset().top <= $(window).scrollTop() + $(window).height())) {
                        indexFlag = index;
                    }
                });
                indexFlag = indexFlag === undefined ? $(".section").length - 1 : indexFlag;
                return indexFlag;
            },
            bindNavBar: function () {
                var _this = this;
                var $navBar = $(".nav span");
                $navBar.each(function (index, item) {
                    $(item).on("click", function (e) {
                        _this.switch(e, this, true);
                        if ($(".section").eq(index).height() < $(window).height()) {//如果模块内容较少，则定位到底边
                            $(window).scrollTop($(".section").eq(index).height() + $(".section").eq(index).offset().top - $(window).height());
                            return;
                        }
                        $(window).scrollTop($("#section" + (index + 1)).offset().top - $(".nav").height());
                    })
                })
            },
            bindScroll: function () {
                var _this = this;
                var index = $(".section").length;
                $(window).on("scroll", function () {
                    var actionAry = [$(".nav .active")];
                    actionAry.pop().removeClass("active");
                    $(".nav span").eq(_this.scrollSwitch()).addClass("active");
                    if (!_this.isSticky()) {//!_this.isSticky() 不支持Sticky时
                        if ($(window).scrollTop() >= _this.navOffsetTop) {//头图滚出屏幕，开始吸顶
                            $(".switch").removeClass("static").addClass("fixed");
                            if ($(window).scrollTop() >= $("#section" + index).offset().top) {//最后一个模块开始滚出屏幕时
                                /*$(".switch").removeClass("fixed").addClass("static");*/
                                //$(".nav").hide();
                            } else {
                                //$(".nav").show();
                            }
                        } else {
                            $(".switch").removeClass("fixed").addClass("static");
                        }
                    }
                    if ($(window).scrollTop() >= _this.navOffsetTop) {

                    }
                    if ($(window).scrollTop() >= $("#section" + index).offset().top) {
                        //$(".nav").hide();
                    } else {
                        //$(".nav").show();
                    }
                })
            },
        };
        var OlderPop = function (options) {
            //回调函数  执行请求操作
            this.callBack = options ? options.callBack : null;
            //登录使用的logo
            this.loginImg = options ? options.loginImg : '';
            //交互成功后弹出的状态图片
            this.sucImg = options ? options.sucImg : '';
            this.newType = options ? options.newType : false;
            this.flag = true;
            this.host = '';
            this.formData = {
                seller_id: "",
                activity_id: "",
                phone: "",
                code: "",
                token: "",
            };
            this.getCodeTimer = null;
            this.isAndroid = BrowserInfo.isAndroid;
            this.isIOS = BrowserInfo.isIphone || BrowserInfo.isIpad;

        };
        OlderPop.prototype = {
            constructor: OlderPop,
            bindEvent:bindEvent,
            offEvent:offEvent,
            show:show,
            getData:getData,
            /*未完善...*/
            createOlderDemo: function () {
                var _this = this;
                var olderStrAry = [];
                olderStrAry[olderStrAry.length] = '<div class="fixed-wrap" style="display: none">';
                olderStrAry[olderStrAry.length] = '<!--领取名额-->';
                olderStrAry[olderStrAry.length] = '<div class="join-info join-info-1" style="display: none">';
                olderStrAry[olderStrAry.length] = '<div class="title-box">';
                olderStrAry[olderStrAry.length] = '<p class="join-title">还差一步就成功啦</p>';
                olderStrAry[olderStrAry.length] = '<p class="join-sub-title">填写您的手机号，商家24小时之内会联系您，沟通到店时间</p>';
                olderStrAry[olderStrAry.length] = '</div>';
                olderStrAry[olderStrAry.length] = '<p class="join-fill join-fill-phone">';
                olderStrAry[olderStrAry.length] = '<input id="phone" type="text" placeholder="填写手机号以便商家联系您" maxlength="11">';
                olderStrAry[olderStrAry.length] = '<span class="error-msg">手机号输入格式错误</span>';
                olderStrAry[olderStrAry.length] = '</p>';
                olderStrAry[olderStrAry.length] = '<p class="join-fill join-fill-code">';
                olderStrAry[olderStrAry.length] = '<input id="code" type="text" placeholder="输入验证码" maxlength="4"><!-';
                olderStrAry[olderStrAry.length] = '-><span class=" disable">获取验证码</span>';
                olderStrAry[olderStrAry.length] = '<span class="error-msg">验证码错误</span>';
                olderStrAry[olderStrAry.length] = '</p>';
                olderStrAry[olderStrAry.length] = '<p class=" join-disable">确认预约</p>';
                olderStrAry[olderStrAry.length] = '</div>';
                olderStrAry[olderStrAry.length] = '<!--预约成功-->';
                olderStrAry[olderStrAry.length] = '<div class="join-info join-info-suc" style="display: none" flex="dir:left main:center cross:center">';
                _this.sucImg ? olderStrAry[olderStrAry.length] = '<img src="' + _this.sucImg + '" alt="">' : '';
                olderStrAry[olderStrAry.length] =
                    '<i class="close"></i>';
                olderStrAry[olderStrAry.length] = '</div>';
                olderStrAry[olderStrAry.length] = '</div>';
                var innerHtml = olderStrAry.join("");
                $("body").append(innerHtml);
                _this.showOlderPop();
                return _this;
            },
            /*未完善...*/
            createLoginDemo: function () {
                var _this = this;
                var loginStrAry = [];
                /*loginStrAry[loginStrAry.length]='<div class="alpha" style="display: none"></div>'*/
                loginStrAry[loginStrAry.length] = '<div class="fixed-wrap" style="display: none">';
                loginStrAry[loginStrAry.length] = '<!--领取名额-->';
                loginStrAry[loginStrAry.length] = '<div class="join-info join-info-1" style="display: none">';
                loginStrAry[loginStrAry.length] = '<div class="title-box" flex="dir:left main:center" style="margin: 0 auto;width: 1.484rem;height: 0.587rem;font-size:0;">';
                loginStrAry[loginStrAry.length] = '<img src="' + _this.loginImg + '" alt="">';
                loginStrAry[loginStrAry.length] = '</div>';

                loginStrAry[loginStrAry.length] = '<p class="join-fill join-fill-phone">';
                loginStrAry[loginStrAry.length] = '<input id="phone" type="text" placeholder="请填写手机号" maxlength="11">';
                loginStrAry[loginStrAry.length] = '<span class="error-msg">手机号输入格式错误</span>';
                loginStrAry[loginStrAry.length] = '</p>';
                loginStrAry[loginStrAry.length] = '<p class="join-fill join-fill-code">';
                loginStrAry[loginStrAry.length] = '<input id="code" type="text" placeholder="输入验证码" maxlength="4"><!-';
                loginStrAry[loginStrAry.length] = '-><span class=" disable">获取验证码</span>';
                loginStrAry[loginStrAry.length] = '<span class="error-msg">验证码错误</span>';
                loginStrAry[loginStrAry.length] = '</p>';
                loginStrAry[loginStrAry.length] = '<p class=" join-disable">确认登录</p>';
                loginStrAry[loginStrAry.length] = '</div>';
                loginStrAry[loginStrAry.length] = '</div>';
                var innerHtml = loginStrAry.join("");
                $("body").append(innerHtml);
                _this.showOlderPop();
                return _this;
            },
            //展示预约弹框
            showOlderPop: function () {
                var _this = this;
                show([".alpha", ".fixed-wrap", ".join-info-1"], true);
                $("html").css({
                    "overflow-y": "hidden",
                    "position": "fixed"
                });
                //绑定背景关闭事件
               _this.bindEvent(".join-info", 'click', _this.stop);
                _this.bindEvent('.fixed-wrap', 'click', function () {
                    _this.close()
                });
                //绑定输入手机号事件
                _this.bindEvent('#phone', 'keyup', _this.inputPhone);
                //绑定获取验证码事件
                _this.bindEvent('.join-fill-code .disable', 'click', _this.getCode);
                //绑定输入验证码事件
                _this.bindEvent('#code', 'keyup', function () {
                    _this.flag = true;
                    $("#code").siblings(".error-msg").css("visibility", "hidden");
                });
                //绑定提交事件
                _this.bindEvent('.join-disable', 'click', _this.submit);
            },
            //展示成功弹框
            showSucStatus: function (reload) {
                var _this = this;
                show([".join-info-1"], false);
                if ((_this.newType) && (!_this.sucImg)) {
                    _this.close();
                    new AlertPop({message: "您已成功预约"});
                    return;
                }
                show([".alpha", ".fixed-wrap", ".join-info-suc"], true);
                _this.offEvent('.fixed-wrap', 'click');
                _this.bindEvent('.close', 'click', function () {
                    _this.close(reload)
                });
            },
            //验证手机号
            checkPhone: function (phone) {
                var reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
                return reg.test(phone)
            },
            //输入手机号
            inputPhone: function () {
                var _this = this;
                _this.flag = true;
                var $phone = $("#phone");
                var $code = $(".join-fill-code").find(".disable");
                var phone = $phone.val();

                $phone.siblings(".error-msg").css("visibility", "hidden");
                if (phone.length >= 11 && _this.checkPhone(phone)) {
                    $code.addClass("get-code");
                    $('.join-disable').addClass("join-submit");
                } else {
                    $code.removeClass("get-code");
                }
            },
            //获取验证码
            getCode: function (e) {
                var _this = this;
                var $target = $(e.target);
                if ($target.hasClass('get-code')) {
                    var obj = {
                        phone: $('#phone').val(),
                        codeType: 0
                    };
                    //TODO
                   getData('/app/api/h5/user/getVerificationCode', 'post', JSON.stringify(obj), function (result) {
                        $target.removeClass('get-code');
                        /*开启倒计时*/
                        if (result.retcode == 0) {
                            _this.countdown.call(_this);
                        } else {
                            $("#code").siblings(".error-msg").text(result.msg).css("visibility", "visible")
                        }
                        // _this.offEvent('.join-fill-code .disable',"click")
                    })
                }
            },
            //倒计时
            countdown: function () {
                var _this = this;
                var $getCode = $('.join-fill-code .disable');
                var count = 60;
                clearInterval(_this.getCodeTimer);
                _this.getCodeTimer = setInterval(function () {
                    if (count <= -1) {
                        clearInterval(_this.timer);
                        $getCode.html('获取验证码');
                        $getCode.addClass('get-code');
                        return;
                    }
                    $getCode.html(count + 's');
                    count--;
                }, 1000)
            },
            submit: function (e) {
                var _this = this;
                var $target = $(e.target);
                if ($target.hasClass("join-submit") && _this.flag) {
                    var phone = $("#phone").val();
                    var code = $("#code").val();
                    if (!_this.checkPhone(phone) || !(/\d{4}/.test(code))) {
                        !_this.checkPhone(phone) ? $("#phone").siblings('.error-msg').css("visibility", 'visible') : null;
                        !(/\d{4}/.test(code)) ? $("#code").siblings('.error-msg').html("验证码错误").css("visibility", 'visible') : null;
                        return;
                    }
                    //TODO
                    _this.flag = false;
                    _this.formData.phone = $("#phone").val();
                    _this.formData.userPhone = $("#phone").val();
                    _this.formData.code = $("#code").val();
                    _this.formData.token = '';
                    if(_this.callBack){
                        _this.callBack.call(_this, _this.formData);
                    }else {
                        throw "缺少点击确定后的回调函数";
                    }
                }
            },
            stop: function (e) {
                var _this = this;
                e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
            },
            //关闭弹框
            close: function (reload) {
                var _this = this;
                show([".alpha", ".fixed-wrap", ".join-info-1"], false);
                show([".alpha", ".fixed-wrap", ".join-info-suc"], false);
                $("html").css({
                    "overflow-y": "scroll",
                    "position": "static"
                });
                $("#phone,#code").val("");
                $('.join-fill-code .disable').removeClass("get-code").text("获取验证码");
                clearInterval(_this.getCodeTimer);
                $(".join-disable").removeClass("join-submit");
                $(".error-msg").css("visibility", "hidden");
                //解绑背景关闭事件
                _this.offEvent(".join-info", 'click');
                _this.offEvent('.fixed-wrap', 'click');
                //解绑输入手机号事件
                _this.offEvent('#phone', 'keyup');
                //解绑获取验证码事件
                _this.offEvent('.join-fill-code .disable', 'click');
                //解绑输入验证码事件
                _this.offEvent('#code', 'keyup');
                //解绑提交事件
                _this.offEvent('.join-disable', 'click');
                _this.newType && $(".fixed-wrap").remove();
                if (reload) {
                    window.location.reload();
                }
            }
        };
        var API = {};
        API.URL = URL;
        API.BrowserInfo = BrowserInfo;
        API.initMainInfo = initMainInfo;
        API.isApp=initMainInfo().isApp;
        API.isToken=initMainInfo().isToken;
        API.isAndroid=BrowserInfo.isAndroid;
        API.isIOS=BrowserInfo.isIpad||BrowserInfo.isIphone;
        API.bindEvent=bindEvent;
        API.offEvent=offEvent;
        API.show=show;
        API.getData=getData;
        /**
         * 从浏览器打开app
         * @param open_url:打开app的地址
         * */
        API.openAppFromWeb = openAppFromWeb;
        API.nativeFn = {
            /**跳商家详情
             * @param sellerId:商家id
             * @param categoryFirstId:商家类别
             * @param type:页面 主页 案例页 。。
             * */
            toSellerDetail: function (sellerId, categoryFirstId, type) {
                var _this = this;
                var nativeFn = new NativeFn();
                if (nativeFn.isApp) {//app内
                    var obj = {
                        category_first_id: categoryFirstId,
                        seller_id: parseInt(sellerId),
                        pageType: type
                    };
                    console.table(obj);
                    nativeFn.toSellerDetail(obj);
                } else {
                    nativeFn.openAPP();
                }
            },
            /*跳文章详情*/
            toArticleDetail: function (articleId, category) {
                var _this = this;
                var nativeFn = new NativeFn();

                if (nativeFn.isApp) {//app内
                    var obj = {
                        category: category,
                        article_id: parseInt(articleId)
                    };
                    console.table(obj);
                    nativeFn.toArticleDetail(obj);
                } else {
                    nativeFn.openAPP();
                }
            },
            /**app活动流程
             * @param sellerId:商家id
             * @param activityId:活动id
             * */
            joinSellerActive: function (sellerId, activityId) {
                var _this = this;
                var nativeFn = new NativeFn();
                if (nativeFn.isApp) {//app内
                    var obj = {
                        seller_id: parseInt(sellerId),
                        activity_id: parseInt(activityId)
                    };
                    console.table(obj);
                    nativeFn.joinSellerActive(obj);
                } else {
                    nativeFn.openAPP();
                }
            },
            /**私信商家
             * @param userId:用户id
             * */
                jsPrivateLetterSeller: function (userId) {
                var _this = this;
                var nativeFn = new NativeFn();
                if (nativeFn.isApp) {//app内
                    var obj = {
                        userId: parseInt(userId)
                    };
                    console.table(obj);
                    nativeFn.privateLetterSeller(obj);
                } else {
                    nativeFn.openAPP();
                }
            },
            /*打开app某一页*/
            openAppPage: function (url) {
                var _this = this;
                var nativeFn = new NativeFn();
                if (nativeFn.isApp) {//app内
                    var obj = {
                        schemeUrl: url
                    };
                    console.table(obj);
                    nativeFn.openAppPage(obj);
                } else {
                    nativeFn.openAPP();
                }
            },
            /*调用打电话*/
            toCallPhone: function (tel) {
                var _this = this;
                var nativeFn = new NativeFn();
                if (nativeFn.isApp) {//app内
                    var obj = {
                        phone: parseInt(tel)
                    };
                    console.table(obj);
                    nativeFn.toCallPhone(obj);
                } else {
                    window.location.href = "tel://" + parseInt(tel);
                }
            },
            /*跳到日记发布页*/
            toEditDiary: function (articleId) {
                var _this = this;
                var nativeFn = new NativeFn();
                if (nativeFn.isApp) {//app内
                    var obj = {
                        articleId: parseInt(articleId)
                    };
                    console.table(obj);
                    nativeFn.toEditDiary(obj);
                } else {
                    nativeFn.openAPP('yuanbo.mobileapp://dreamweddingApp/openApp/brideDiaryPublish?articleId=0',"yuanbo.mobileapp://dreamweddingApp/brideDiaryPublish?articleId=0");
                }
            },
            openApp:function(a){new NativeFn().openAPP(a)},
            countAll: function(event_name, event_value){new NativeFn().countAll(event_name, event_value)},
            login: function(user){new NativeFn().toLogin(user)},
            backPage: function(){new NativeFn().backPage()}
        };
        API.AlertPop = AlertPop;
        API.ImageCenter = ImageCenter;
        API.ScrollSwitch = ScrollSwitch;
        API.OlderPop=OlderPop;
        API.version=version;
        return API;
    }

})(window, undefined);