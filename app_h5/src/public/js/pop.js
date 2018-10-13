/**
 * Created by YYBJ on 2018/6/14.
 */
function OlderPop(options){
    //回调函数  执行请求操作
    this.callBack=options?options.callBack:null;
    //登录使用的logo
    this.loginImg=options?options.loginImg:'';
    //交互成功后弹出的状态图片
    this.sucImg=options?options.sucImg:'';
    this.newType=options?options.newType:false;
    this.flag=true;
    this.host='';
    this.formData = {
        seller_id: "",
        activity_id: "",
        phone: "",
        code: "",
        token: "",
    };
    this.getCodeTimer=null;
    this.isAndroid=utils.BrowserInfo().isAndroid;
    this.isIOS=utils.BrowserInfo().isIphone||utils.BrowserInfo().isIpad;

}
OlderPop.prototype={
    constructor:OlderPop,
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
    /**
     * @param eles 元素选择器
     * @param flag true：显示  false：隐藏*/
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
    /*调用app登录方法*/
    Login:function(obj){
        var _this=this;
        if((utils.initMainInfo().isApp)&&(!utils.initMainInfo().isToken)){
            if (obj) {
                //去登录
                //需判断android/ios
                if(_this.isAndroid){
                    utils.initMainInfo().isApp && window.android&&window.android.jsObtainUserInfo(JSON.stringify(obj));
                }
                if(_this.isIOS){
                    utils.initMainInfo().isApp&&window.webkit && window.webkit.messageHandlers.jsObtainUserInfo.postMessage(obj);
                }
            }
        }
    },
    /*未完善...*/
    createOlderDemo:function(){
        var _this=this;
        var olderStrAry=[];
        olderStrAry[olderStrAry.length]='<div class="fixed-wrap" style="display: none">';
        olderStrAry[olderStrAry.length]='<!--领取名额-->';
        olderStrAry[olderStrAry.length]='<div class="join-info join-info-1" style="display: none">';
        olderStrAry[olderStrAry.length]='<div class="title-box">';
        olderStrAry[olderStrAry.length]='<p class="join-title">还差一步就成功啦</p>';
        olderStrAry[olderStrAry.length]='<p class="join-sub-title">填写您的手机号，商家24小时之内会联系您，沟通到店时间</p>';
        olderStrAry[olderStrAry.length]='</div>';
        olderStrAry[olderStrAry.length]='<p class="join-fill join-fill-phone">';
        olderStrAry[olderStrAry.length]='<input id="phone" type="text" placeholder="填写手机号以便商家联系您" maxlength="11">';
        olderStrAry[olderStrAry.length]='<span class="error-msg">手机号输入格式错误</span>';
        olderStrAry[olderStrAry.length]='</p>';
        olderStrAry[olderStrAry.length]='<p class="join-fill join-fill-code">';
        olderStrAry[olderStrAry.length]='<input id="code" type="text" placeholder="输入验证码" maxlength="4"><!-';
        olderStrAry[olderStrAry.length]='-><span class=" disable">获取验证码</span>';
        olderStrAry[olderStrAry.length]='<span class="error-msg">验证码错误</span>';
        olderStrAry[olderStrAry.length]='</p>';
        olderStrAry[olderStrAry.length]='<p class=" join-disable">确认预约</p>';
        olderStrAry[olderStrAry.length]='</div>';
        olderStrAry[olderStrAry.length]='<!--预约成功-->';
        olderStrAry[olderStrAry.length]='<div class="join-info join-info-suc" style="display: none" flex="dir:left main:center cross:center">';
        _this.sucImg?olderStrAry[olderStrAry.length]='<img src="'+_this.sucImg+'" alt="">':'';
        olderStrAry[olderStrAry.length]=
            '<i class="close"></i>';
        olderStrAry[olderStrAry.length]='</div>';
        olderStrAry[olderStrAry.length]='</div>';
        var innerHtml=olderStrAry.join("");
        $("body").append(innerHtml);
        //_this.showOlderPop();
        return _this;
    },
    /*未完善...*/
    createLoginDemo:function(){
        var _this=this;
        var loginStrAry=[];
        loginStrAry[loginStrAry.length]='<div class="fixed-wrap" style="display: none">';
        loginStrAry[loginStrAry.length]='<!--领取名额-->';
        loginStrAry[loginStrAry.length]='<div class="join-info join-info-1" style="display: none">';
        loginStrAry[loginStrAry.length]='<div class="title-box" flex="dir:left main:center" style="margin: 0 auto;width: 1.484rem;height: 0.587rem">';
        loginStrAry[loginStrAry.length]='<img src="'+_this.loginImg+'" alt="">';
        loginStrAry[loginStrAry.length]='</div>';

        loginStrAry[loginStrAry.length]='<p class="join-fill join-fill-phone">';
        loginStrAry[loginStrAry.length]='<input id="phone" type="text" placeholder="请填写手机号" maxlength="11">';
        loginStrAry[loginStrAry.length]='<span class="error-msg">手机号输入格式错误</span>';
        loginStrAry[loginStrAry.length]='</p>';
        loginStrAry[loginStrAry.length]='<p class="join-fill join-fill-code">';
        loginStrAry[loginStrAry.length]='<input id="code" type="text" placeholder="输入验证码" maxlength="4"><!-';
        loginStrAry[loginStrAry.length]='-><span class=" disable">获取验证码</span>';
        loginStrAry[loginStrAry.length]='<span class="error-msg">验证码错误</span>';
        loginStrAry[loginStrAry.length]='</p>';
        loginStrAry[loginStrAry.length]='<p class=" join-disable">确认登录</p>';
        loginStrAry[loginStrAry.length]='</div>';
        loginStrAry[loginStrAry.length]='</div>';
        var innerHtml=loginStrAry.join("");
        $("body").append(innerHtml);
        _this.showOlderPop();
        return _this;
    },
    //展示预约弹框
    showOlderPop:function(){
        var _this=this;
        _this.show([".alpha",".fixed-wrap",".join-info-1"],true);
        $("html").css({
            "overflow-y":"hidden",
            "position":"fixed"
        });
        //绑定背景关闭事件
        _this.bindEvent(".join-info", 'click', _this.stop);
        _this.bindEvent('.fixed-wrap', 'click', function(){_this.close()});
        //绑定输入手机号事件
        _this.bindEvent('#phone', 'keyup', _this.inputPhone);
        //绑定获取验证码事件
        _this.bindEvent('.join-fill-code .disable', 'click', _this.getCode);
        //绑定输入验证码事件
        _this.bindEvent('#code', 'keyup', function () {
            _this.flag=true;
            $("#code").siblings(".error-msg").css("visibility", "hidden");
        });
        //绑定提交事件
        _this.bindEvent('.join-disable', 'click', _this.submit);
    },
    //展示成功弹框
    showSucStatus:function(reload){
        var _this=this;
        _this.show([".join-info-1"],false);
        if((_this.newType)&&(!_this.sucImg)){
            _this.close();
            new AlertPop({message:"您已成功预约"});
            return;
        }
        _this.show([".alpha",".fixed-wrap",".join-info-suc"],true);
        _this.offEvent('.fixed-wrap', 'click');
        _this.bindEvent('.close', 'click', function(){_this.close(reload)});
    },
    //验证手机号
    checkPhone:function(phone) {
        var reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
        return reg.test(phone)
    },
    //输入手机号
    inputPhone: function () {

        var _this = this;
        _this.flag=true;
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
            _this.getData('/base/user/UserAction_getVerificationCode', 'post', JSON.stringify(obj), function (result) {
                $target.removeClass('get-code');
                /*开启倒计时*/
                if(result.retcode==0){
                    _this.countdown.call(_this);
                }else {
                    $("#code").siblings(".error-msg").text(result.msg).css("visibility","visible")
                }
                // _this.offEvent('.join-fill-code .disable',"click")
            })
        }
    },
    //倒计时
    countdown: function () {
        var _this=this;
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
        if ($target.hasClass("join-submit")&&_this.flag) {
            var phone = $("#phone").val();
            var code = $("#code").val();
            if (!_this.checkPhone(phone) || !(/\d{4}/.test(code))) {
                !_this.checkPhone(phone) ? $("#phone").siblings('.error-msg').css("visibility", 'visible') : null;
                !(/\d{4}/.test(code)) ? $("#code").siblings('.error-msg').html("验证码错误").css("visibility", 'visible') : null;
                return;
            }
            //TODO
            _this.flag=false;
            _this.formData.phone = $("#phone").val();
            _this.formData.userPhone=$("#phone").val();
            _this.formData.code = $("#code").val();
            _this.formData.token = '';
            _this.callBack.call(_this,_this.formData);

        }
    },
    stop:function(e){
        var _this=this;
        e.stopPropagation?e.stopPropagation():e.cancelBubble=true;
    },
    //关闭弹框
    close:function(reload){
        var _this=this;
        _this.show([".alpha",".fixed-wrap",".join-info-1"],false);
        _this.show([".alpha",".fixed-wrap",".join-info-suc"],false);
        $("html").css({
            "overflow-y":"scroll",
            "position":"static"
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
        _this.newType&&$(".fixed-wrap").remove();
        if(reload){
            window.location.reload();
        }
    }
};