/**
 * Created by YYBJ on 2018/4/19.
 */
var utils = (function () {
    function getAllUrl() {
        return {
            openUrl: 'https://www.menghunli.com/download',//ios打开app
            WeixinUrl: 'http://android.myapp.com/myapp/detail.htm?apkName=com.dream.wedding',
            downAndroidUrl: 'https://product-uploadtoapps.oss-cn-beijing.aliyuncs.com/app_update/hqApp-700002-release.apk',//安卓下载
            downIosUrl: 'itms-apps://itunes.apple.com/app/id1304807209'//ios下载
        }
    }

    function BrowserInfo() {
        var json = {
            userAgent: navigator.userAgent.toLowerCase(),
            isAndroid: Boolean(navigator.userAgent.match(/android/ig)),
            isIphone: Boolean(navigator.userAgent.match(/iphone|ipod/ig)),
            isIpad: Boolean(navigator.userAgent.match(/ipad/ig)),
            isWeixin: Boolean(navigator.userAgent.match(/MicroMessenger/ig))
        };
        return json;
    }

    function openOrDown(openUrl, callback, canClick) {
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
        if (BrowserInfo().isIphone || BrowserInfo().isIpad) {
            location.href = openUrl;
        } else {
            ifr.src = openUrl;
        }
        ifr.style.display = 'none';
        if (callback) {
            //客户端检测微信直接跳应用宝链接
            var browser = BrowserInfo();
            //使用微链接
            var encodeUri = encodeURIComponent(openUrl);

            if (browser.isWeixin) {
                //window.location.href = '微链url&android_schema='+encodeUri;
                browser.isIphone || browser.isIpad
                    ? window.location.href = getAllUrl().downIosUrl
                    : window.location.href = getAllUrl().WeixinUrl;
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

    }

    function callBack(opened) {
        var browser = BrowserInfo();
        if (opened == 1) {//打开了app

        } else {//没打开去下载
            if (browser.isWeixin) {//在微信上
                window.location.href = getAllUrl().WeixinUrl;
            } else if (browser.isIphone || browser.isIpad) {//在ios上
                window.location = getAllUrl().downIosUrl;
            } else {//其他浏览器中
                window.location = getAllUrl().downAndroidUrl;
            }
        }
    }

    /**
     * @open_url: 要打开APP的地址*/
    function handler(open_url) {
        utils.openOrDown(open_url, callBack);
    }

    /*判断登录状态*/
    function initMainInfo() {
        var _this = this;
        var phone = null, token = null;
        var user, isApp;
        user = localStorage.getItem("user_info");
        if (user) {
            user = JSON.parse(user);
            phone = user.phone;
            token = user.token;
        }
        /*user={
            phone:"15727395536",
            token:"eyJ0eXAiOiJKV1MiLCJhbGciOiJIUzI1NiJ9.eyJleHBpcmVUaW1lIjoxNTI5MDU3MTQyNTM5LCJ1c2VyUm9sZSI6MiwidXNlcklkIjo0NDk4MH0.cyl2HpFXJMvGKIuLy8uicd4h3EOsMhzwOJOZIyeR7wQ",
            nickName:"下雨吧"
        };*/
        if (BrowserInfo().isAndroid) {
            isApp = window.android ? true : false;
        } else if (BrowserInfo().isIphone || BrowserInfo().isIpad) {
            isApp = user && user != '' ? true : false;
        }
        return {
            isApp:isApp,
            isToken:(token) && (token != '') ? true : false,
            user: user
        }
    };
    return {
        BrowserInfo: BrowserInfo,
        openOrDown: openOrDown,
        handler: handler,
        initMainInfo: initMainInfo
    }
})();
/**
 * @param {message,isReload}
* */
function AlertPop(options) {
    this.msg = options.message;
    this.isReload=options.isReload||false;
    this.alertStr = '';
    this.appendAlert();
}
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
        setTimeout(function () {
            $(".alert-pop").remove();
            if(_this.isReload){
                window.location.reload()
            }
        }, 800)
    }
};

function NativeFn() {
    this.openUrl = {
        andriodUrl:"yuanbo.mobileapp://dreamweddingApp/openApp",
        IOSUrl:"https://www.menghunli.com/download"
    };

    this.isAndroid = utils.BrowserInfo().isAndroid;
    this.isIOS = utils.BrowserInfo().isIpad || utils.BrowserInfo().isIphone;
    this.isApp = utils.initMainInfo().isApp;
    this.isToken=utils.initMainInfo().isToken;
    this.user=utils.initMainInfo().user;
}
NativeFn.prototype = {
    constructor: NativeFn,
    /**启动APP
     * @param */
    openAPP: function () {
        var _this = this;
        if (_this.isAndroid) {
            utils.handler(_this.openUrl.andriodUrl);
            return;
        }
        if (_this.isIOS) {
            //utils.handler(_this.openUrl.IOSUrl);
            utils.handler("https://www.menghunli.com/download");
            return
        }
    },

    /** 启动APP某页
     * @param */
    openPage: function () {

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
    toSiteDetail: function () {
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
    openAppPage:function(obj){
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

    }
};

function ImageCenter() {
    this.lazyLoad();
}
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

function ScrollSwitch() {
    if($(".nav").length){
        this.navOffsetTop=$(".nav").offset().top;
    }
}
ScrollSwitch.prototype={
    constructor:ScrollSwitch,
    /**
    * @param:e 事件
    * @param:ele 事件元素(切换元素)
     * @param:type type:true时切换卡片
    * */
    switch:function(e,ele,type){
        var actionAry=[$(".switch .active")];
        actionAry.pop().removeClass("active");
        $(ele).addClass("active");
        if(type){
            var ctrlContent=[$("main .show")];
            ctrlContent.pop().removeClass("show");
            $("."+$(ele).attr("switch-ctrl")).addClass("show");
        }else {
            return;
        }
    },
    /*判断是否支持position:sticky*/
    isSticky:function(){
        var nav=document.getElementsByClassName("nav")[0];
        return /sticky/i.test(window.getComputedStyle(nav).position);
    },
    /*返回滚动到第几个模块*/
    scrollSwitch:function(){
        var _this=this;
        var indexFlag;
        $("section").each(function(index,item){
            if(($(item).height()+$(item).offset().top>=$(window).scrollTop()+$(window).height())&&($(item).offset().top<=$(window).scrollTop()+$(window).height())){
                indexFlag= index;
            }
        });
        indexFlag=indexFlag===undefined?$(".section").length-1:indexFlag;
        return indexFlag;
    },
    bindNavBar:function(){
        var _this=this;
        var $navBar=$(".nav span");
        $navBar.each(function(index,item){
            $(item).on("click",function(e){
                _this.switch(e,this,true);
                if($(".section").eq(index).height()<$(window).height()){//如果模块内容较少，则定位到底边
                    $(window).scrollTop($(".section").eq(index).height()+$(".section").eq(index).offset().top-$(window).height());
                    return;
                }
                $(window).scrollTop($("#section"+(index+1)).offset().top-$(".nav").height());
            })
        })
    },
    bindScroll:function(){
        var _this=this;
        var index=$(".section").length;
        $(window).on("scroll",function(){
            var actionAry=[$(".nav .active")];
            actionAry.pop().removeClass("active");
            $(".nav span").eq(_this.scrollSwitch()).addClass("active");
            if(!_this.isSticky()){//!_this.isSticky() 不支持Sticky时
                if($(window).scrollTop()>=_this.navOffsetTop){//头图滚出屏幕，开始吸顶
                    $(".switch").removeClass("static").addClass("fixed");
                    if($(window).scrollTop()>=$("#section"+index).offset().top){//最后一个模块开始滚出屏幕时
                        /*$(".switch").removeClass("fixed").addClass("static");*/
                        //$(".nav").hide();
                    }else {
                        //$(".nav").show();
                    }
                }else{
                    $(".switch").removeClass("fixed").addClass("static");
                }
            }
            if($(window).scrollTop()>=_this.navOffsetTop){

            }
            if($(window).scrollTop()>=$("#section"+index).offset().top){
                //$(".nav").hide();
            }else {
                //$(".nav").show();
            }
        })
    },
};
function Tools() {
    this.native=new NativeFn();
    this.host='';
}
Tools.prototype={
    constructor:Tools,
    initMainInfo:utils.initMainInfo,
    /**
     * @param {string} ele
     * @param {string} type
     * @param {function array} fn
     */
    bindEvent: function (ele, type, fn) {
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
    offEvent: function (ele, type) {
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
    show: function (eles, flag) {
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
    getData: function (url, method, data, callback) {
        var _this=this;
        $.ajax({
            headers:{
                "Content-Type":"application/json;charset=UTF-8"
            },
            url: _this.host+url,
            type: method,
            data: data,
            dataType: 'json',
            success: function (result) {
                callback(result);
            }
        })
    },
    /**跳商家详情
     * @param self 绑定事件的元素本身
     * @param categoryFirstId 跳转商家的类别
     * @param type 跳转至商家 详情 案例*/

    toSellerDetail:function(self,categoryFirstId,type){
        var _this=this;
        var nativeFn=new NativeFn();
        if($(self).hasClass("level-btn")){
            self=self.parentNode;
        }
        if(nativeFn.isApp){//app内
            var obj={
                category_first_id:categoryFirstId,
                seller_id:parseInt($(self).attr("seller_id")),
                pageType:type
            };
            console.table(obj);
            nativeFn.toSellerDetail(obj);
        }else {
            nativeFn.openAPP();
        }
    },
    /*跳文章详情*/
    toArticleDetail:function(self,category){
        var _this=this;
        var nativeFn=new NativeFn();
        if($(self).hasClass("level-btn")){
            self=self.parentNode;
        }
        if(nativeFn.isApp){//app内
            var obj={
                category:category,
                article_id:parseInt($(self).attr("article_id"))
            };
            console.table(obj);
            nativeFn.toArticleDetail(obj);
        }else {
            nativeFn.openAPP();
        }
    },
    /*app活动流程*/
    joinSellerActive:function (self) {
        var _this=this;
        var nativeFn=new NativeFn();
        if($(self).hasClass("level-btn")){
            self=self.parentNode;
        }
        if(nativeFn.isApp){//app内
            var obj={
                seller_id:parseInt($(self).attr("seller_id")),
                activity_id:parseInt($(self).attr("activity_id"))
            };
            console.table(obj);
            nativeFn.joinSellerActive(obj);
        }else {
            nativeFn.openAPP();
        }
    },
    /*私信商家*/
    jsPrivateLetterSeller:function(self){
        var _this=this;
        var nativeFn=new NativeFn();
        if($(self).hasClass("level-btn")){
            self=self.parentNode;
        }
        if(nativeFn.isApp){//app内
            var obj={
                userId:parseInt($(self).attr("user_id"))
            };
            console.table(obj);
            nativeFn.privateLetterSeller(obj);
        }else {
            nativeFn.openAPP();
        }
    },
    /*打开app某一页*/
    openAppPage:function(url){
        var _this=this;
        var nativeFn=new NativeFn();
        if(nativeFn.isApp){//app内
            var obj={
                schemeUrl:url
            };
            console.table(obj);
            nativeFn.openAppPage(obj);
        }else {
            nativeFn.openAPP();
        }
    },
    /*调用打电话*/
    toCallPhone:function(self){
        var _this=this;
        var nativeFn=new NativeFn();
        if(nativeFn.isApp){//app内
            var obj={
                phone:parseInt($(self).attr("tel"))
            };
            console.table(obj);
            nativeFn.toCallPhone(obj);
        }else {
            window.location.href="tel://"+parseInt($(self).attr("tel"));
        }
    }
};

