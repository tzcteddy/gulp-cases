(function (global,factory) {
  typeof exports === 'object' && typeof module !== void 0 ? module.exports=factory():
    typeof define === 'function' && define.amd ? define(factory):
      (global.MHLH5=factory())
})(this,function () { 'use strict';
  function getCookie(name){
    let arr,
      reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if(arr = document.cookie.match(reg)){
      return (arr[2]);
    }else{
      return null;
    }
  }
  function setCookie(name, value, expiredays){
    let exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = name + "=" + escape(value) + ";path=/;" + ((expiredays == null) ? "" : "expires=" + exdate.toGMTString());
  }
  function clearCookie(){
    let keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
      for (let i in keys){
        document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()+"; path=/";
      }
    }
  }
  function encodeHtml(sHtml){
    return sHtml.replace(/[<>&"]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c];});
  }
  function decodeHtml(str){
    var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'};
    return str.replace(/&(lt|gt|nbsp|amp|quot);/ig,function(all,t){return arrEntities[t];});
  }
  function removeHtmlTag(str){
    return str.replace(/<\/?.+?>/g,"")
  }
  function formatDate(stamp, type){
    if(!stamp){
      return "";
    }
    const now = new Date(parseInt(stamp));
    const year =now.getFullYear();
    const month = now.getMonth() + 1 < 10 ? "0" + (now.getMonth() + 1) : now.getMonth() + 1;
    const day = now.getDate() < 10 ? "0" + now.getDate() : now.getDate();
    const hour = now.getHours() < 10 ? "0" + now.getHours() : now.getHours();
    const minute = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
    const second = now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds();
    if(type == "HM"){
      return hour + ":" + minute;
    }else if(type == "MDHM"){
      return month + "-" + day + " " + hour + ":" + minute;
    }else if(type == "YMD"){
      return year + "-" + month + "-" + day;
    }else if(type == "YM"){
      return year + "-" + month;
    }else if(type == "Y"){
      return year;
    }else{
      return year + "-" + month + "-" + day + " " + hour + ":" + minute;
    }
  }
  function getDate(val){
    let time = new Date(val)
    let year = time.getFullYear()
    let month = time.getMonth()+1
    let day = time.getDate()
    let hour = time.getHours()
    let minutes = time.getMinutes()
    if(month<10){
      month = '0'+month
    }
    if (day<10) {
      day = '0'+day
    }
    if (hour<10) {
      hour='0'+hour
    }
    if (minutes<10) {
      minutes = '0'+minutes
    }
    return ""+year+"-"+month+"-"+day+" "+hour+":"+minutes+""
  }
  var defaultExport$2 = function defaultExport (all) {
    this.all = all || Object.create(null);
  };

  defaultExport$2.prototype.on = function on (type, handler) {
    (this.all[type] || (this.all[type] = [])).push(handler);
  };

  defaultExport$2.prototype.off = function off (type, handler) {
    if (this.all[type]) {
      this.all[type].splice(this.all[type].indexOf(handler) >>> 0, 1);
    }
  };

  defaultExport$2.prototype.emit = function emit (type, evt) {
    (this.all[type] || []).map(function (handler) { handler(evt); })
    ;(this.all['*'] || []).map(function (handler) { handler(type, evt); });
  };
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
    isApp: Boolean(win.navigator.userAgent.toLowerCase().match(/dreamWedding/ig))
  };
  var MHLH5 = (function (Emmiter) {
    return {

    }
  })(defaultExport$2);
  return MHLH5
});
