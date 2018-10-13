/**
 * Created by YYBJ on 2018/9/7.
 */
(function(window,undefined){
    String.prototype.myQueryURLParameter = function () {
        var reg = /([^?=#&]+)=([^?=#&]+)/g,
            obj = {};
        this.replace(reg, function () {
            obj[arguments[1]] = arguments[2];
        });
        //->GET HASH
        reg = /#([^?=#&]+)/;
        this.replace(reg, function () {
            obj['HASH'] = arguments[1];
        });
        return obj;
    };
    window.MHLMk=function(options){
        this.from=options.from;//是否启用渠道号
        this.testin=options.testin;//是否使用云测（先引入集成SDK）
        this.testinAB=options.testinAB||undefined;
        this.appKey=options.appKey;//云测唯一项目标识
        this.testinBackObj=options.testinBackObj;//埋点
        this.btnId=options.btnId||["down"];//点击按钮

        this.channelId=options.channelId||"700002";
        this.BrowserInfo = {
            isAndroid: Boolean(navigator.userAgent.toLowerCase().match(/android/ig)),
            isIphone: Boolean(navigator.userAgent.toLowerCase().match(/iphone|ipod/ig)),
            isIpad: Boolean(navigator.userAgent.toLowerCase().match(/ipad/ig)),
            isWeixin: Boolean(navigator.userAgent.toLowerCase().match(/micromessenger/ig))
        };
        this.android=this.BrowserInfo.isAndroid;
        this.iphone=this.BrowserInfo.isIpad||this.BrowserInfo.isIphone;
        this.init();

    };
    MHLMk.prototype={
        constructor:MHLMk,
        initDownUrl:function (){
            var _this=this;
            _this.channelId=_this.from&&location.href.myQueryURLParameter().from?location.href.myQueryURLParameter().from:this.channelId?this.channelId:"700002";
            var androidDownUrl="https://product-uploadtoapps.oss-cn-beijing.aliyuncs.com/apk_download/hqApp-"+_this.channelId+"-release.apk";
            var iosDownUrl="https://itunes.apple.com/cn/app/id1304807209";
            return {
                androidDownUrl:androidDownUrl,
                iosDownUrl:iosDownUrl
            }
        },
        redirectDownUrl:function(){
            var _this=this;
            if(_this.android){
                location.href=_this.initDownUrl().androidDownUrl;
                return;
            }else if(_this.iphone){
                location.href=_this.initDownUrl().iosDownUrl;
                return;
            }
        },
        initTestin:function(){
            var _this=this;
            var testinAB=_this.testinAB?_this.testinAB:undefined;
            if(_this.testin){
                testinAB&&testinAB.init(_this.appKey);
                testinAB&&testinAB.loadMultiLink();
            }
        },
        activeTestinCount:function(key){
            var _this=this;
            if(_this.testin){
                //_this.initTestin();不用每次绑定都初始化testin,需放到init函数中

                if(_this.testinBackObj){
                    if(Object.prototype.toString.call(_this.testinBackObj[key])=="[object Function]"){
                        _this.testinBackObj[key]();
                    }
                }else {
                    throw ("没有找到统计方法，请查看终端类型")
                }

            }
        },
        bindEvent:function () {
            var _this=this;
            for(var i=0;i<_this.btnId.length;i++){
                var btn=document.getElementById(_this.btnId[i]);
                btn.index=i;
                btn.addEventListener("click",function(){
                    var self=this;
                    _this.activeTestinCount(_this.btnId[self.index]);
                    if(self.getAttribute("down")=="down"){
                        _this.redirectDownUrl()
                    }
                })
            }
        },
        init:function(){
            var _this=this;
            _this.testin?_this.initTestin():null;
            _this.bindEvent()
        }

    }
})(window,undefined);
