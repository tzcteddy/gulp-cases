(function (global,factory) {
  global=global?global:window;
  typeof exports === 'object' && typeof module !== void 0 ? module.exports=factory():
    typeof define === 'function' && define.amd ? define(factory):
      (global.MHLH5=factory())
})(this,function () { 'use strict';
  function Element(tagName, props, children) {
    if (!(this instanceof Element)) {
      return new Element(tagName, props, children);
    }

    this.tagName = tagName;
    this.props = props || {};
    this.children = children || [];
    this.key = props ? props.key : undefined;

    let count = 0;
    this.children.forEach((child) => {
      if (child instanceof Element) {
        count += child.count;
      }
      count++;
    });
    this.count = count;
  }
  Element.prototype.setAttr = function(node, key, value){
    switch (key) {
      case 'style':
        node.style.cssText = value;
        break;
      case 'value': {
        const tagName = node.tagName.toLowerCase() || '';
        if (tagName === 'input' || tagName === 'textarea') {
          node.value = value;
        } else {
          node.setAttribute(key, value);
        }
        break;
      }
      default:
        node.setAttribute(key, value);
        break;
    }
  };
  Element.prototype.render = function() {
    let _this=this;
    const el = document.createElement(this.tagName);
    const props = this.props;

    for (const propName in props) {
      _this.setAttr(el, propName, props[propName]);
    }

    this.children.forEach((child) => {
      const childEl = (child instanceof Element) ? child.render() : document.createTextNode(child);
      el.appendChild(childEl);
    });

    return el;
  };
  const doc = (typeof document === 'undefined') ? {
    body: {},
    addEventListener: function addEventListener() {
    },
    removeEventListener: function removeEventListener() {
    },
    activeElement: {
      blur: function blur() {
      },
      nodeName: '',
    },
    querySelector: function querySelector() {
      return null;
    },
    querySelectorAll: function querySelectorAll() {
      return [];
    },
    getElementById: function getElementById() {
      return null;
    },
    createEvent: function createEvent() {
      return {
        initEvent: function initEvent() {
        },
      };
    },
    createElement: function createElement() {
      return {
        children: [],
        childNodes: [],
        style: {},
        setAttribute: function setAttribute() {
        },
        getElementsByTagName: function getElementsByTagName() {
          return [];
        },
      };
    },
    location: {hash: ''},
  } : document;
  const win = (typeof window === 'undefined') ? {
    document: doc,
    navigator: {
      userAgent: '',
    },
    location: {},
    history: {},
    CustomEvent: function CustomEvent() {
      return this;
    },
    addEventListener: function addEventListener() {
    },
    removeEventListener: function removeEventListener() {
    },
    getComputedStyle: function getComputedStyle() {
      return {
        getPropertyValue: function getPropertyValue() {
          return '';
        },
      };
    },
    Image: function Image() {
    },
    Date: function Date() {
    },
    setTimeout: function setTimeout() {
    },
    clearTimeout: function clearTimeout() {
    },
    localStorage: {
      getItem: function getItem() {
      },
      setItem: function setItem() {
      },
    }
  } : window;
  const BrowserInfo = {
    isAndroid: Boolean(win.navigator.userAgent.toLowerCase().match(/android/ig)),
    isIOS:Boolean(win.navigator.userAgent.toLowerCase().match(/iphone|ipod|ipad/ig)),
    isIphone: Boolean(win.navigator.userAgent.toLowerCase().match(/iphone|ipod/ig)),
    isIpad: Boolean(win.navigator.userAgent.toLowerCase().match(/ipad/ig)),
    isWeixin: Boolean(win.navigator.userAgent.toLowerCase().match(/micromessenger/ig)),
    isApp: Boolean(win.navigator.userAgent.toLowerCase().match(/dreamWedding/ig)),
  };
  function getUser() {
    let user = win.localStorage.getItem("user_info");
    if (user) {
      user = JSON.parse(user);
      return user
    }
  }
  function getVersionNum(){
    var ver=initMainInfo().user?initMainInfo().user.appVer:null;
    if(ver){
      var verNum = parseInt(ver.replace(/\./g,""));
      return verNum;
    }else {
      return 0
    }
  }
  function initMainInfo() {
    let _this = this;
    //let user = userTest;
    let user = getUser();
    return {
      isApp: BrowserInfo.isApp ,
      isLogin: !!user&&(!!user.token) && (user.token !== ''),
      user: user
    }
  };
  function getWeddingHeader(){
    let user = initMainInfo().user;
    let weddingHeader = {};
    if (user && user.appVer) {
      weddingHeader = {
        appVersion: user.appVer,
        platform: user.platform,
        deviceId: user.deviceId,
        channel: user.channel
      };
      if (Boolean(user.token)) {
        weddingHeader.token = user.token;
      }
    }
    return weddingHeader
  }
  function getData(url, method, data) {
    let _this = this;
    return new Promise((resolve, reject) => {
      $.ajax({
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          "weddingHeader": JSON.stringify(getWeddingHeader())
        },
        url: url,
        type: method,
        data: data,
        dataType: 'json',
        success: (result) => {
          resolve(result);
        },
        error: err => {
          reject(err);
        }

      })
    })
  };
  /**
   * @param {string} ele
   * @param {string} type
   * @param {function array} fn
   */
  function bindEvent(ele, type, fn) {
    var _this = this;
    if (typeof ele === 'string') {
      $(ele).on(type, function (e) {
        if (Object.prototype.toString.call(fn) === '[object Function]') {
          fn.call(_this, e, this);
        }
        if (Object.prototype.toString.call(fn) === '[object Array]') {
          for (var i = 0; i < fn.length; i++) {
            fn[i].call(_this, e, this);
          }
        }
      })
    }
  }
    /**
     * @param {string} ele
     * @param {string} type
     */
    function offEvent(ele, type) {
      var _this = this;
      if (typeof ele === 'string') {
        if (typeof type === "string") {
          $(ele).off(type)
        }
        if (Object.prototype.toString.call(type) === '[object Array]') {
          for (var i = 0; i < type.length; i++) {
            $(ele).off(type[i]);
          }
        }
      }
    }
    //展示工具函数
    function show(eles, flag) {
      var _this = this;
      if (typeof eles === 'string') {
        flag ? $(eles).show() : $(eles).hide();
      }
      if (Object.prototype.toString.call(eles) === '[object Array]') {
        for (var i = 0; i < eles.length; i++) {
          flag ? $(eles[i]).show() : $(eles[i]).hide();
        }
      }
    }
  function configWx(shareTitle, shareLink, shareImgUrl, shareDesc) {
    //document.title = shareTitle;
    let data = JSON.stringify({
      url: location.href
    });
    getData("/app/api/wx/WeixinAction_getWXConfigSignature", "post", data).then(result => {
      if (result.retcode === 0) {
        wx.config({
          debug: false,
          appId: result.resp.appId,
          timestamp: result.resp.timestamp,
          nonceStr: result.resp.nonceStr,
          signature: result.resp.signature,
          jsApiList: [
            'onMenuShareAppMessage', 'onMenuShareTimeline',
            'onMenuShareQQ', 'onMenuShareQZone'
          ]
        });
        wx.ready(function () {
          wx.onMenuShareTimeline({
            title: shareTitle, // 分享标题
            link: shareLink, // 分享链接
            imgUrl: shareImgUrl, // 分享图标
            success: function () {
              // 用户确认分享后执行的回调函数
            },
            cancel: function () {

            }
          });
          wx.onMenuShareAppMessage({
            title: shareTitle, // 分享标题
            desc: shareDesc, // 分享描述
            link: shareLink, // 分享链接
            imgUrl: shareImgUrl, // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
              // 用户确认分享后执行的回调函数
            },
            cancel: function () {

            }
          });
          wx.onMenuShareQQ({
            title: shareTitle, // 分享标题
            desc: '', // 分享描述
            link: shareLink, // 分享链接
            imgUrl: shareImgUrl, // 分享图标
            success: function () {
              // 用户确认分享后执行的回调函数
            },
            cancel: function () {
              // 用户取消分享后执行的回调函数
            }
          });
        });
      } else {
        console.log(result.msg)
      }
    });
  };

  class OpenApp {
    constructor(options) {
      if(options === void 0) options = {};
      this.channelId = ( options.channelId) || "700002";
      let URL=this.getDownloadUrl(this.channelId);
      this.openUrl = ( options.openUrl) ||URL.openApp;
      this.weiXinUrl = URL.weiXinUrl;
      this.downloadUrl=URL.downloadUrl;
      this.isActive = ( options.isActive) || false;
      this.isActive && this.init(this.openUrl);
    }
    getDownloadUrl(channelId){
      let downAndroidUrl= "https://product-uploadtoapps.oss-cn-beijing.aliyuncs.com/apk_download/hqApp-"+channelId+"-release.apk";
      let downIOSUrl= "itms-apps://itunes.apple.com/app/id1304807209";
      let URL = {
        openUrl: 'https://www.menghunli.com/download',//jump to download page
        openApp:'yuanbo.mobileapp://dreamweddingApp/openApp',
        weiXinUrl: 'http://android.myapp.com/myapp/detail.htm?apkName=com.dream.wedding',
        downloadUrl: BrowserInfo.isIOS?downIOSUrl:downAndroidUrl
      };
      return URL
    }
    callBack(opened) {
      let _this = this;
      if (opened === 1) {//打开了app
      } else {//没打开去下载
        if (BrowserInfo.isWeixin) {//在微信上
          BrowserInfo.isIOS ? win.location.href = _this.downloadUrl : win.location.href = _this.weiXinUrl;
        } else {
          win.location=_this.downloadUrl
        }
      }
    }

    openOrDown(openUrl) {
      let _this = this;
      openUrl = openUrl || _this.openUrl;

      //检查app是否打开
      function checkOpen(cb) {
        let _clickTime = +(new Date());

        function check(elsTime) {
          if (elsTime > 3000 || doc.hidden || doc.webkitHidden) {
            cb(1);
          } else {
            cb(0);
          }
        }

        //启动间隔20ms运行的定时器，并检测累计消耗时间是否超过3000ms，超过则结束
        let _count = 0, intHandle;
        intHandle = setInterval(function () {
          _count++;
          let elsTime = +(new Date()) - _clickTime;
          if (_count >= 100 || elsTime > 3000) {
            clearInterval(intHandle);
            check(elsTime);
          }
        }, 20);
      }


      //在iframe 中打开APP
      let ifr = document.createElement('iframe');
      if (BrowserInfo.isIOS) {
        location.href = openUrl;
      } else {
        ifr.src = openUrl;
      }
      ifr.style.display = 'none';

      if (_this.callBack) {
        //客户端检测微信直接跳应用宝链接
        //使用微链接
        let encodeUri = encodeURIComponent(openUrl);

        if (BrowserInfo.isWeixin) {
          //window.location.href = '微链url&android_schema='+encodeUri;
          BrowserInfo.isIOS
            ? win.location.href = _this.downloadUrl
            : win.location.href = _this.weiXinUrl;
        } else {
          checkOpen((opened)=>{
            _this.callBack && _this.callBack.call(_this, opened);
          });
        }
      }
      document.body.appendChild(ifr);
      setTimeout(()=>{
        document.body.removeChild(ifr);
      }, 2000);

    }

    resetChannelId(channelId) {
      let _this = this;
      _this.channelId = channelId || "700002";
      _this.downloadUrl=_this.getDownloadUrl(_this.channelId).downloadUrl;
      _this.init(_this.openUrl);
    }

    init(open_url) {
      let _this = this;
      _this.openOrDown(open_url)
    }
  }
  class NativeFn {
    constructor() {
      this.isAndroid = BrowserInfo.isAndroid;
      this.isIOS = BrowserInfo.isIOS;
      let {isApp,isLogin,user}=initMainInfo();
      this.isApp = isApp;
      this.isLogin = isLogin;
      this.user = user;
    }

    /**启动APP**/
    openAppFn() {
      new OpenApp({isActive: true});
    }

    /**跳商家详情
     * @param obj
     * */
    toSellerDetailFn(obj) {
      let _this = this;
      if (_this.isAndroid) {
        _this.isApp && window.android && window.android.jsPushSellerDetail(JSON.stringify(obj));
        return;
      }
      if (_this.isIOS) {
        _this.isApp && window.webkit && window.webkit.messageHandlers.jsPushSellerDetail.postMessage(obj);
        return;
      }
    }

    /**APP内跳到文章（案例、作品等）详情页
     * @param obj
     * */
    toArticleDetailFn(obj) {
      let _this = this;
      if (_this.isIOS) {
        _this.isApp && window.webkit && window.webkit.messageHandlers.jsPushArticleDetail.postMessage(obj);
        return;
      }
      if (_this.isAndroid) {
        _this.isApp && window.android && window.android.jsPushArticleDetail(JSON.stringify(obj));
        return;
      }
    }

    /**商家活动—参与活动
     * @param obj
     * */
    joinSellerActiveFn(obj) {
      let _this = this;
      if (_this.isIOS) {
        _this.isApp && window.webkit && window.webkit.messageHandlers.jsAppointSeller.postMessage(obj);
        return;
      }
      if (_this.isAndroid) {
        _this.isApp && window.android && window.android.jsAppointSeller(JSON.stringify(obj));
        return;
      }
    }

    /**APP内调用私信商家
     * @param obj
     * */
    privateLetterSellerFn(obj) {
      let _this = this;
      if (_this.isIOS) {
        _this.isApp && window.webkit && window.webkit.messageHandlers.jsPrivateLetterSeller.postMessage(obj);
        return;
      }
      if (_this.isAndroid) {
        _this.isApp && window.android && window.android.jsPrivateLetterSeller(JSON.stringify(obj));
        return;
      }
    }

    /**打开app某页
     * @param obj
     * */
    openAppPageFn(obj) {
      let _this = this;
      if (_this.isIOS) {
        _this.isApp && window.webkit && window.webkit.messageHandlers.jsOpenAppPage.postMessage(obj);
        return;
      }
      if (_this.isAndroid) {
        _this.isApp && window.android && window.android.jsOpenAppPage(JSON.stringify(obj));
        return;
      }
    }

    /**APP内调用电话
     * @param obj
     * */
    toCallPhoneFn(obj) {
      let _this = this;
      if (_this.isIOS) {
        _this.isApp && window.webkit && window.webkit.messageHandlers.jsCallPhone.postMessage(obj);
        return;
      }
      if (_this.isAndroid) {
        _this.isApp && window.android && window.android.jsCallPhone(JSON.stringify(obj));
        return;
      }
    }

    /**跳到日记发布页
     * @param obj
     * articleId:0*/
    toEditDiaryFn(obj) {
      let _this = this;
      if (_this.isIOS) {
        _this.isApp && window.webkit && window.webkit.messageHandlers.jsPushPublishDiary.postMessage(obj);
        return;
      }
      if (_this.isAndroid) {
        _this.isApp && window.android && window.android.jsPushPublishDiary(JSON.stringify(obj));
        return;
      }
    }

    /**统计
     * @param event_name[string]
     * @param event_value[object]*/
    countAllFn(event_name, event_value) {
      let _this = this;
      let obj = {
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
    }

    /**APP内调用登陆
     * @param Object*/
    toLoginFn(user) {
      let _this = this;
      if (_this.isAndroid) {
        _this.isApp && window.android && window.android.jsObtainUserInfo(JSON.stringify(user));
        return;
      }
      if (_this.isIOS) {
        _this.isApp && window.webkit && window.webkit.messageHandlers.jsObtainUserInfo.postMessage(user);
        return;
      }

    }

    /*JS 跳入社区发现页面*/
    toCommunityFn() {
      let _this = this;
      if (_this.isIOS) {
        _this.isApp && window.webkit && window.webkit.messageHandlers.jsPushCommunityFind.postMessage({});
        return;
      }
      if (_this.isAndroid) {
        _this.isApp && window.android && window.android.jsPushCommunityFind();
        return;
      }
    }

    /*调用app返回*/
    backPageFn() {
      let _this = this;
      if (_this.isAndroid) {
        _this.isApp && window.android && window.android.jsBackToPreviousPage();
        return;
      }
      if (_this.isIphone || _this.isIpad) {
        _this.isApp && window.webkit && window.webkit.messageHandlers.jsBackToPreviousPage.postMessage({});
        return;
      }
    }

    /*ios专用，回传页面高度*/
    giveHeightFn(obj) {
      let _this = this;
      if (_this.isIOS) {
        _this.isApp && window.webkit && window.webkit.messageHandlers.jsAppObtainWebViewHeight.postMessage(obj);
        return;
      }

    }
  }
  class NativeBridge extends NativeFn {
    constructor() {
      super()
    }
    /**跳商家详情
     * @param sellerId:商家id
     * @param categoryFirstId:商家类别
     * @param type:页面 主页 案例页 。。
     * */
    toSellerDetail(sellerId, categoryFirstId, type) {
      let _this = this;
      if (_this.isApp) {//app内
        let obj = {
          category_first_id: categoryFirstId,
          seller_id: parseInt(sellerId),
          pageType: type
        };
        console.table(obj);
        _this.toSellerDetailFn(obj);
      } else {
        _this.openAppFn();
      }
    }

    /**跳文章详情*
     * @param articleId:文章ID
     * @param category:文章类型
     * */
    toArticleDetail(articleId, category) {
      let _this = this;
      if (_this.isApp) {//app内
        let obj = {
          category: category,
          article_id: parseInt(articleId)
        };
        console.table(obj);
        _this.toArticleDetailFn(obj);
      } else {
        _this.openAppFn();
      }
    }

    /**app活动流程
     * @param sellerId:商家id
     * @param activityId:活动id
     * */
    joinSellerActive(sellerId, activityId) {
      let _this = this;
      if (_this.isApp) {//app内
        let obj = {
          seller_id: parseInt(sellerId),
          activity_id: parseInt(activityId)
        };
        console.table(obj);
        _this.joinSellerActiveFn(obj);
      } else {
        _this.openAppFn();
      }
    }

    /**私信商家
     * @param userId:用户id
     * */
    jsPrivateLetterSeller(userId) {
      let _this = this;
      if (_this.isApp) {//app内
        let obj = {
          userId: parseInt(userId)
        };
        console.table(obj);
        _this.privateLetterSellerFn(obj);
      } else {
        _this.openAppFn();
      }
    }

    /**打开app某一页
     * @param url:跳转地址
     * **/
    openAppPage(url) {
      let _this = this;
      if (_this.isApp) {//app内
        let obj = {
          schemeUrl: url
        };
        console.table(obj);
        _this.openAppPageFn(obj);
      } else {
        _this.openAppFn();
      }
    }

    /**调用打电话
     * @param sellerId:商家ID
     * **/
    toCallPhone(sellerId) {
      let _this = this;
      if (_this.isApp) {//app内
        let obj = {
          sellerId: sellerId
        };
        console.table(obj);
        _this.toCallPhoneFn(obj);
      } else {
        //window.location.href = "tel://" + tel;
      }
    }
    /**跳到日记发布页
     * @param articleId:日记Id
     * **/
    toEditDiary(articleId) {
      let _this = this;
      if (_this.isApp) {//app内
        let obj = {
          articleId: parseInt(articleId)
        };
        console.table(obj);
        _this.toEditDiaryFn(obj);
      } else {
        let url;
        if (_this.isAndroid) {
          url = 'yuanbo.mobileapp://dreamweddingApp/openApp/brideDiaryPublish?articleId=0';
        } else if (_this.isIOS) {
          url = 'yuanbo.mobileapp://dreamweddingApp/brideDiaryPublish?articleId=0'
        }
        new OpenApp({openUrl: url, isActive: true})
      }
    }
    /**
     * @param event_name:事件名称
     * @param event_value:触发参数
     * */
    countAll(event_name, event_value) {
      let _this = this;
      _this.isApp && _this.countAllFn(event_name, event_value)
    }
    /**登录
     * @param user:接口返回的user
     * */
    login(user) {
      let _this = this;
      _this.isApp && _this.toLoginFn(user);
    }
    /*JS 跳入社区发现页面*/
    toCommunity() {
      let _this = this;
      _this.isApp && _this.toCommunityFn();
    }
    /**返回上一页*/
    backPage() {
      let _this = this;
      _this.isApp && _this.backPageFn();
    }
  }
  class AlertPop {
    constructor(options) {
      this.msg = options.message;
      this.timer = options.timer || 800;
      this.isReload = options.isReload || false;
      this.alertStr = '';
      this.appendAlert();
    }
    createEle() {
      let _this = this;
      let alertTree=Element("div",{class:"alert-pop"},[
        Element("div",{class:"alert-mask"},[]),
        Element("div",{class:"alert-msg"},[
          Element("span",{class:"alert-text"},[this.msg])
        ])
      ]);
     return alertTree.render();
    }
    appendAlert() {
      let _this = this;
      var alertDom=_this.createEle();
      var body=document.body;
      body.appendChild(alertDom);
      _this.close();
    }
    close() {
      let _this = this;
      if ($(".alert-pop").fadeOut) {
        $(".alert-pop").fadeOut(_this.timer, function () {
          $(".alert-pop").remove();
          if (_this.isReload) {
            window.location.reload()
          }
        });
        return
      }
      setTimeout(function () {
        $(".alert-pop").remove();
        if (_this.isReload) {
          window.location.reload()
        }
      }, _this.timer)
    }
  }
  class AppointPop {
    constructor(options) {
      this.type = options.type;
      this.message = options.message;
      this.callBack = options.callBack;
      this.inserHtml = '';
      this.init();
    }
    addPop() {
      let _this = this;
      let appointTree=Element("div",{class:"mask-appoint"},[
        Element("i",{class:"mark-bg"},[]),
        Element("div",{class:"mask-box"},[
          Element("div",{class:"mask-message"},[ _this.message,
            Element("br",{},[]),"是否确认预约？"]),
          Element("div",{class:"mask-opera"},[
            Element("span",{class:"mask-btn mask-cancel"},["取消"]),
            Element("span",{class:"mask-btn mask-sure"},["确定"]),
          ])
        ])
      ]);
      let appointDom=appointTree.render();
      let body=document.body;
      body.appendChild(appointDom);
      $("html").css({
        "overflow-y": "hidden",
        "height": "100%"
      });
      _this.sureClick();
      _this.closeClick();
    }
    sureClick() {
      let _this = this;
      $(".mask-appoint .mask-sure").on("click", function () {
        if (typeof _this.callBack == "function") {
          _this.callBack();
          _this.removePop();
        }
      })
    }
    closeClick() {
      let _this = this;
      $(".mask-appoint .mask-cancel").on("click", function () {
        _this.removePop();
      })
    }
    removePop() {
      let _this = this;
      $(".mask-appoint").remove();
      $("html").css({
        "overflow-y": "scroll",
        "height": "auto"
      });
    }
    init() {
      let _this = this;
      _this.addPop();
    }
  }
  class Loading {
    constructor(options){
      this.loadingDiv=null;
      this.strokeWidth = options.strokeWidth || 2;
      this.strokeColor = options.strokeColor || "#ED3943"
    }
    createElement(){
      let loadingTree=Element("div",{class:"loading"},[
        Element("div",{class:"loading-mark"},[]),
        Element("div",{class:"loader"},[
          Element("svg",{class:"circular",viewBox:"25 25 50 50"},[
            Element("circle",{class:"path",cx:"50",cy:"50",r:"20",fill:"none",stroke:this.strokeColor,"stroke-width":this.strokeWidth ,"stroke-miterlimit":"10"},[])
          ])
        ])
      ]);
      this.loadingDiv=loadingTree.render();
    }
    open(){
      var _this=this;
      var body=document.body;
      _this.createElement();
      body.appendChild(_this.loadingDiv);
    }
    close(){
      var _this=this;
      this.loadingDiv.parentNode.removeChild(this.loadingDiv);
    }
  }
  class ImageCenter {
    constructor() {
      this.lazyLoad();
    }
    lazyLoad() {
      let _this = this;
      let $images = $('img.lazy');
      for (let i = 0; i < $images.length; i++) {
        _this.imgLoadPosition($images[i])
      }
      $images.lazyload({
        effect: "fadeIn",
        /*threshold: 200,*/
        effectspeed: 200,
      })
    }
    imgLoad(img, callBack) {
      let tempImag = new Image,
        tempSrc = $(img).attr("data-original"),//n
        imgSrc = $(img).attr("src");//e
      imgSrc == tempSrc ? tempImag.src = img.src : (tempImag.src = tempSrc || imgSrc);
      /*$(img).hide();
      $(img).fadeIn(300);*/
      tempImag.onload = function () {
        $(img).attr("src", tempSrc);
        callBack(img, tempImag)
      }
    }

    imgLoadPosition(img) {
      let _this = this;
      $(img).hide();
      _this.imgLoad(img, (img, tempImg) => {
        let tempW = tempImg.width //模板图宽
          , tempH = tempImg.height //模板图高
          , boxW = $(img).parent().width() //盒子宽
          , boxH = $(img).parent().height() //盒子高
          , boxScale = boxW / boxH //盒子宽高比
          , tempScale = tempW / tempH; //模板宽高比
        if (boxScale < tempScale) { //如果盒子比例大于模板比例
          let equalScaleW = boxH * tempScale
            , positionL = (equalScaleW - boxW) / 2;
          $(img).removeAttr("width"),
            $(img).css({
              position: "absolute",
              top: 0,
              height: boxH + "px",
              left: -positionL + "px",
              width: "auto"
            })
        } else {
          let equalScaleW = boxH * tempScale
            , positionL = (equalScaleW - boxH) / 2
            , equalScaleH = boxW / tempScale
            , positionT = (equalScaleH - boxH) / 2;
          $(img).css({
            position: "absolute",
            top: -positionT + "px",
            height: "auto",
            left: 0,
            width: "100%"
          })
        }
        $(img).hide();
        $(img).fadeIn(300);
      })
    }
  }
  class Switch {
    constructor() {
      this.$nav = $(".nav");
      this.$navBar = $(".nav-bar");
      this.tabScrollTop = this.$nav.offset().top;
      this.init();
    }
    clickSwitch(e, ele, index, type) {
      let actionAry = [$(".nav .nav-box .active")];
      actionAry.pop().removeClass("active");
      $(ele).addClass("active");
      if (type) {//卡片切换
        let ctrlContent = [$("main section.show")];
        ctrlContent.pop().removeClass("show");
        $("." + $(ele).attr("switch-ctrl")).addClass("show");
      } else {
        return;
      }
    }
    scrollSwitch(){
      let _this=this;
      let actionAry = [$(".nav .active")];
      actionAry.pop().removeClass("active");
      _this.$navBar.eq(_this.currentIndex()).addClass("active");
    }
    currentIndex() {
      let _this = this;
      let indexFlag;
      $("section").each(function (index, item) {
        let smallBox=$(item).height()<$(window).height();
        let allEntry=($(item).height() + $(item).offset().top<$(window).scrollTop() + $(window).height());
        //盒子高度+盒子上偏移量>=滚动条高度+屏幕高度，盒子底部还未进入可视窗口
        let endEntry = ($(item).height() + $(item).offset().top >= $(window).scrollTop() + $(window).height());
        //console.log("endEntry",endEntry);
        //盒子上偏移量<=滚动条高度+屏幕高度，盒子头部进入可视窗口
        let startEntry = ($(item).offset().top <= $(window).scrollTop() + $(window).height());
        //console.log("startEntry",startEntry);
          //console.log("index",index);
        if (startEntry ){
            indexFlag = index;
          }
      });
      indexFlag = indexFlag === undefined ? $(".section").length - 1 : indexFlag;
      //console.log("indexFlag",indexFlag);
      return indexFlag;
    }
    scroll(isSwitch) {
      let _this = this;
      $(window).on("scroll", function () {
        let scrollTop = $(window).scrollTop();
        if (scrollTop >= _this.tabScrollTop) {
          _this.$nav.addClass("nav-fixed");
        } else {
          _this.$nav.removeClass("nav-fixed");
        }
        isSwitch?_this.scrollSwitch():null;
      })
    }
    /*锚点定位*/
    anchorSwitch() {
      let _this = this;
      let index = _this.$navBar.length;
      _this.$navBar.each(function (index, item) {
        $(item).on("click", function () {
          let scrollTop = $(window).scrollTop();
          let isSmallBox=$("#section" + (index)).height()<$(window).height();
          if (scrollTop >= _this.tabScrollTop) {
            var scrollNum = $("#section" + (index)).offset().top - _this.$nav.height();
            if(isSmallBox){
              scrollNum=$("#section" + (index)).offset().top+$("#section" + (index)).height()-$(window).height();
            }
          } else {//如果导航还没浮动，上偏移量需减去两个导航高度
            var scrollNum = $("#section" + (index)).offset().top - 2 * _this.$nav.height();
            if(isSmallBox){
              scrollNum=$("#section" + (index)).offset().top+$("#section" + (index)).height()-$(window).height();
            }
          }
          $(window).scrollTop(scrollNum);
        })
      });
      _this.scroll(true);
    }

    /*卡片切换*/
    cardSwitch(cb) {
      let _this = this;
      _this.$navBar.each(function (index, item) {
        $(item).on("click", function (e) {
          cb && typeof cb === 'function' ? cb() : null;
          $(window).scrollTop(_this.tabScrollTop);
          _this.clickSwitch(e, this, index, 1)
        })
      })
    }

    init() {
      let _this = this;
      _this.scroll();
    }
  }
  class OlderPop {
    constructor(options) {
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
      this.codeLength=getVersionNum()>=424?6:4;
      this.isAndroid = BrowserInfo.isAndroid;
      this.isIOS = BrowserInfo.isIOS;
    }
    /*未完善...*/
    createLoginDemo() {
      let _this = this;
      let loginTree=Element("div",{class:"fixed-wrap",style:"display:none;"},[
        Element("div",{class:"join-info join-info-1",style:"display: none"},[
          Element("div",{class:"title-box",flex:"dir:left main:center"},[
            Element("img",{src: _this.loginImg,alt:""})
          ]),
          Element("p",{class:"join-fill join-fill-phone"},[
            Element("input",{id:"phone",type:"text",placeholder:"请填写手机号",maxlength:"11"},[]),
            Element("span",{class:"error-msg"},["手机号输入格式错误"])
          ]),
          Element("p",{class:"join-fill join-fill-code"},[
            Element("input",{id:"code",type:"text",placeholder:"输入验证码",maxlength:_this.codeLength},[]),
            Element("span",{class:"disable"},["获取验证码"]),
            Element("span",{class:"error-msg"},["验证码错误"])
          ]),
          Element("p",{class:"join-disable"},["确认登录"]),
        ])
      ]);
      _this.loginDom=loginTree.render();
     var body=document.body;
     body.appendChild(_this.loginDom);
      _this.showOlderPop();
      return _this;
    }

    //展示预约弹框
    showOlderPop() {
      var _this = this;
      show([".alpha", ".fixed-wrap", ".join-info-1"], true);
      $("html").css({
        "overflow-y": "hidden",
        "height": "100%"
      });
      //绑定背景关闭事件
      bindEvent(".join-info", 'click', (e) => {
        _this.stop(e)
      });
      bindEvent('.fixed-wrap', 'click', () => {
        _this.close()
      });
      //绑定输入手机号事件
      bindEvent('#phone', 'keyup', () => {
        _this.inputPhone()
      });
      //绑定获取验证码事件
      bindEvent('.join-fill-code .disable', 'click', (e) => {
        _this.getCode(e)
      });
      //绑定输入验证码事件
      bindEvent('#code', 'keyup', () => {
        _this.flag = true;
        $("#code").siblings(".error-msg").css("visibility", "hidden");
      });
      //绑定提交事件
      bindEvent('.join-disable', 'click', (e) => {
        _this.submit(e)
      });
    }

    //展示成功弹框
    showSucStatus(reload) {
      let _this = this;
      show([".join-info-1"], false);
      if ((_this.newType) && (!_this.sucImg)) {
        _this.close();
        new AlertPop({message: "您已成功预约"});
        return;
      }
      show([".alpha", ".fixed-wrap", ".join-info-suc"], true);
      offEvent('.fixed-wrap', 'click');
      bindEvent('.close', 'click', () => {
        _this.close(reload)
      });
    }

    //验证手机号
    checkPhone(phone) {
      let reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
      return reg.test(phone)
    }

    //输入手机号
    inputPhone() {
      let _this = this;
      _this.flag = true;
      let $phone = $("#phone");
      let $code = $(".join-fill-code").find(".disable");
      let phone = $phone.val();

      $phone.siblings(".error-msg").css("visibility", "hidden");
      if (phone.length >= 11 && _this.checkPhone(phone)) {
        $code.addClass("get-code");
        $('.join-disable').addClass("join-submit");
      } else {
        $code.removeClass("get-code");
      }
    }

    //获取验证码
    getCode(e) {
      let _this = this;
      let $target = $(e.target);
      if ($target.hasClass('get-code')) {
        let obj = {
          phone: $('#phone').val(),
          codeType: 0
        };
        if(getVersionNum()>=424){
          obj.appVersion=initMainInfo().user.appVer;
        }
        //TODO
        getData('/app/api/h5/user/getVerificationCode', 'post', JSON.stringify(obj)).then((result) => {
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
    }

    //倒计时
    countdown() {
      let _this = this;
      let $getCode = $('.join-fill-code .disable');
      let count = 60;
      clearInterval(_this.getCodeTimer);
      _this.getCodeTimer = setInterval(() => {
        if (count <= -1) {
          clearInterval(_this.timer);
          $getCode.html('获取验证码');
          $getCode.addClass('get-code');
          return;
        }
        $getCode.html(count + 's');
        count--;
      }, 1000)
    }
    loginFn (obj) {

      var param={
        "phone":obj.phone,
        "code":obj.code?obj.code:null
      };
      var _this=this;
      //TODO：登录接口(走登录的逻辑)
       getData("/app/api/h5/user/login","post",JSON.stringify(param)).then((result)=>{
         if(result.retcode==0){
           $("#phone").val('');
           $("#code").val('');
           $('.join-fill-code .disable').removeClass("get-code");
           $(".join-disable").removeClass("join-submit");
           if((initMainInfo().isApp)){
             if(initMainInfo().isLogin){
               //$(".vouchers .get-gift").removeClass("disable");
             }else {
               //_this.flag=true;
             }
           }
           _this.close&&_this.close();
           new NativeBridge().login(result.resp.user);
           window.location.reload();
         }else{
           $("#code").siblings(".error-msg").text(result.msg).css("visibility","visible")
         }
       })
    }
    submit(e) {
      let _this = this;
      let $target = $(e.target);
      if ($target.hasClass("join-submit") && _this.flag) {
        var phone = $("#phone").val();
        var code = $("#code").val();
        var codeFlag;
        if(getVersionNum()>=424){
          codeFlag=/\d{6}/.test(code);
        }else {
          codeFlag=/\d{4}/.test(code);
        }
        if (!_this.checkPhone(phone) || !codeFlag) {
          !_this.checkPhone(phone) ? $("#phone").siblings('.error-msg').css("visibility", 'visible') : null;
          !(codeFlag) ? $("#code").siblings('.error-msg').html("验证码错误").css("visibility", 'visible') : null;
          return;
        }
        //TODO
        _this.flag = false;
        _this.formData.phone = $("#phone").val();
        _this.formData.userPhone = $("#phone").val();
        _this.formData.code = $("#code").val();
        _this.formData.token = '';
        _this.loginFn(_this.formData);
        /*if (_this.callBack) {
          _this.callBack.call(_this, _this.formData);
        } else {
          throw "缺少点击确定后的回调函数";
        }*/
      }
    }
    stop(e) {
      let _this = this;
      e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
    }

    //关闭弹框
    close(reload) {
      let _this = this;
      show([".alpha", ".fixed-wrap", ".join-info-1"], false);
      show([".alpha", ".fixed-wrap", ".join-info-suc"], false);
      $("html").css({
        "overflow-y": "scroll",
        "height": "auto"
      });
      $("#phone,#code").val("");
      $('.join-fill-code .disable').removeClass("get-code").text("获取验证码");
      clearInterval(_this.getCodeTimer);
      $(".join-disable").removeClass("join-submit");
      $(".error-msg").css("visibility", "hidden");
      //解绑背景关闭事件
      offEvent(".join-info", 'click');
      offEvent('.fixed-wrap', 'click');
      //解绑输入手机号事件
      offEvent('#phone', 'keyup');
      //解绑获取验证码事件
      offEvent('.join-fill-code .disable', 'click');
      //解绑输入验证码事件
      offEvent('#code', 'keyup');
      //解绑提交事件
      offEvent('.join-disable', 'click');
      _this.newType && $(".fixed-wrap").remove();
      if (reload) {
        window.location.reload();
      }
    }
  }
  var MHLH5 = (function () {
    return function MHLH5(opt){
      if(!opt)opt={};
      let status=opt.status;
      let userModel={
        phone:"15727395536",
        nickName:"下雨吧",
        appVer:"4.2.4",
        channel:"100001",
        deviceId:"7f12d08a6d436ceccbe6136264c3bc0a",
        platform:"1",
      };

      let setApp=()=>{
        if(userModel.token)delete userModel.token;
        win.localStorage.setItem("user_info",JSON.stringify(userModel));
        BrowserInfo.isApp=true;
      };
      let setLogin=()=>{
        BrowserInfo.isApp=true;
        userModel.token="A813E702D3D998B5CA61C36DA5E744CE";
        win.localStorage.setItem("user_info",JSON.stringify(userModel));
      };
      let setWeb=()=>{
        win.localStorage.removeItem("user_info");
      };
      let setDefault=()=>{
         !BrowserInfo.isApp?win.localStorage.removeItem("user_info"):null;
      };
      switch (status){
        case "app":
          setApp();
          break;
        case "login":
          setLogin();
          break;
        case "web":
          setWeb();
          break;
        default:
          setDefault();
          break;
      }
      return {
        BrowserInfo:BrowserInfo,
        getUser:getUser,
        getVersionNum:getVersionNum,
        getWeddingHeader:getWeddingHeader,
        initMainInfo:initMainInfo,
        configWx:configWx,
        getData:getData,
        OpenApp:OpenApp,
        NativeBridge:NativeBridge,
        AlertPop:AlertPop,
        AppointPop:AppointPop,
        Loading:Loading,
        ImageCenter:ImageCenter,
        Switch:Switch,
        OlderPop:OlderPop
      }
    };
  })();
  return MHLH5
});


