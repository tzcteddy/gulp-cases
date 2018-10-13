/**
 * Created by YYBJ on 2018/6/13.
 */
/*var turnplate = {
    restaraunts: [], //大转盘奖品名称
    colors: [], //大转盘奖品区块对应背景颜色
    gailv: [],  //各奖品概率
    outsideRadius: 192, //大转盘外圆的半径
    textRadius: 155, //大转盘奖品位置距离圆心的距离
    insideRadius: 68, //大转盘内圆的半径
    startAngle: 0, //开始角度
    bRotate: false //false:停止;ture:旋转
};

$(document).ready(function() {
    //动态添加大转盘的奖品与奖品区域背景颜色
    turnplate.restaraunts = ["特等奖", "一等奖","一等奖", "二等奖 ","二等奖 ", "三等奖","三等奖","三等奖"];
    turnplate.colors = ["transparent", "transparent", "transparent", "transparent","transparent", "transparent", "transparent", "transparent"];
    turnplate.gailv = [0.1, 0.1, 0.2, 0.6];

    var rotateTimeOut = function() {
        $('#wheelcanvas').rotate({
            angle: 0,
            animateTo: 2160,
            duration: 8000,
            callback: function() {
                alert('网络超时，请检查您的网络设置！');
            }
        });
    };

    //旋转转盘 item:奖品位置; txt：提示语;
    var rotateFn = function(item, txt) {
        var angles = item * (360 / turnplate.restaraunts.length) - (360 / (turnplate.restaraunts.length * 2));
        if (angles < 270) {
            angles = 270 - angles;
        } else {
            angles = 360 - angles + 270;
        }
        $('#wheelcanvas').stopRotate();
        $('#wheelcanvas').rotate({
            angle: 0,
            animateTo: angles + 1800,
            duration: 8000,
            callback: function() {
                alert(txt);
                turnplate.bRotate = !turnplate.bRotate;
            }
        });
    };

    $('.pointer').click(function() {
        if (turnplate.bRotate) return;
        turnplate.bRotate = !turnplate.bRotate;
        //获取随机数(奖品个数范围内)
        var item;
        var fanwei = [0];
        for (var i = 1; i < turnplate.restaraunts.length + 1; i++) {
            fanwei[i] = fanwei[i - 1] + turnplate.gailv[i - 1];
        }
        console.log(fanwei);
        var ran = rnd();
        for (var i = 0; i < turnplate.restaraunts.length; i++) {
            if ((ran >= fanwei[i] * 10000 && ran <= fanwei[i + 1] * 10000)) {
                item = i + 1;
                break;
            }
        }
        //奖品数量等于10,指针落在对应奖品区域的中心角度[252, 216, 180, 144, 108, 72, 36, 360, 324, 288]
        rotateFn(item, turnplate.restaraunts[item - 1]);
        console.log(item);
    });
});

function rnd() {
    var random = Math.floor(Math.random() * 10000 + 1);
    return random;
}

//页面所有元素加载完毕后执行drawRouletteWheel()方法对转盘进行渲染
window.onload = function() {
    drawRouletteWheel();
};

function drawRouletteWheel() {
    var canvas = document.getElementById("wheelcanvas");
    if (canvas.getContext) {
        //根据奖品个数计算圆周角度
        var arc = Math.PI / (turnplate.restaraunts.length / 2);
        var ctx = canvas.getContext("2d");
        //在给定矩形内清空一个矩形
        ctx.clearRect(0, 0, 422, 422);
        //strokeStyle 属性设置或返回用于笔触的颜色、渐变或模式
        ctx.strokeStyle = "#FFBE04";
        //font 属性设置或返回画布上文本内容的当前字体属性
        ctx.font = '24px Microsoft YaHei';
        for (var i = 0; i < turnplate.restaraunts.length; i++) {
            var angle = turnplate.startAngle + i * arc;
            ctx.fillStyle = turnplate.colors[i];
            ctx.beginPath();
            //arc(x,y,r,起始角,结束角,绘制方向) 方法创建弧/曲线（用于创建圆或部分圆）
            ctx.arc(211, 211, turnplate.outsideRadius, angle, angle + arc, false);
            ctx.arc(211, 211, turnplate.insideRadius, angle + arc, angle, true);
            ctx.stroke();
            ctx.fill();
            //锁画布(为了保存之前的画布状态)
            ctx.save();

            //----绘制奖品开始----
            ctx.fillStyle = "#FFF";
            var text = turnplate.restaraunts[i];
            var line_height = 17;
            //translate方法重新映射画布上的 (0,0) 位置
            ctx.translate(211 + Math.cos(angle + arc / 2) * turnplate.textRadius, 211 + Math.sin(angle + arc / 2) * turnplate.textRadius);

            //rotate方法旋转当前的绘图
            ctx.rotate(angle + arc / 2 + Math.PI / 2);

            /!** 下面代码根据奖品类型、奖品名称长度渲染不同效果，如字体、颜色、图片效果。(具体根据实际情况改变) **!/
            if (text.indexOf("M") > 0) { //流量包
                var texts = text.split("M");
                for (var j = 0; j < texts.length; j++) {
                    ctx.font = j == 0 ? 'bold 20px Microsoft YaHei' : '16px Microsoft YaHei';
                    if (j == 0) {
                        ctx.fillText(texts[j] + "M", -ctx.measureText(texts[j] + "M").width / 2, j * line_height);
                    } else {
                        ctx.fillText(texts[j], -ctx.measureText(texts[j]).width / 2, j * line_height);
                    }
                }
            } else if (text.indexOf("M") == -1 && text.length > 6) { //奖品名称长度超过一定范围
                text = text.substring(0, 6) + "||" + text.substring(6);
                var texts = text.split("||");
                for (var j = 0; j < texts.length; j++) {
                    ctx.fillText(texts[j], -ctx.measureText(texts[j]).width / 2, j * line_height);
                }
            } else {
                //在画布上绘制填色的文本。文本的默认颜色是黑色
                //measureText()方法返回包含一个对象，该对象包含以像素计的指定字体宽度
                ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
            }

            //添加对应图标
            var img = document.getElementById("shan-img");
            img.onload = function() {
                ctx.drawImage(img, -15, 20);
            };
            ctx.drawImage(img, -15, 20);

            //把当前画布返回（调整）到上一个save()状态之前
            ctx.restore();
            //----绘制奖品结束----
        }
    }
}*/
(function($) {
    var supportedCSS,styles=document.getElementsByTagName("head")[0].style,toCheck="transformProperty WebkitTransform OTransform msTransform MozTransform".split(" ");
    for (var a=0;a<toCheck.length;a++) if (styles[toCheck[a]] !== undefined) supportedCSS = toCheck[a];
// Bad eval to preven google closure to remove it from code o_O
// After compresion replace it back to var IE = 'v' == '\v'
    var IE = eval('"v"=="\v"');

    $.extend($.fn,{
        rotate:function(parameters)
        {
            if (this.length===0||typeof parameters=="undefined") return;
            if (typeof parameters=="number") parameters={angle:parameters};
            var returned=[];
            for (var i=0,i0=this.length;i<i0;i++)
            {
                var element=this.get(i);
                if (!element.Wilq32 || !element.Wilq32.PhotoEffect) {

                    var paramClone = $.extend(true, {}, parameters);
                    var newRotObject = new Wilq32.PhotoEffect(element,paramClone)._rootObj;

                    returned.push($(newRotObject));
                }
                else {
                    element.Wilq32.PhotoEffect._handleRotation(parameters);
                }
            }
            return returned;
        },
        getRotateAngle: function(){
            var ret = [];
            for (var i=0,i0=this.length;i<i0;i++)
            {
                var element=this.get(i);
                if (element.Wilq32 && element.Wilq32.PhotoEffect) {
                    ret[i] = element.Wilq32.PhotoEffect._angle;
                }
            }
            return ret;
        },
        stopRotate: function(){
            for (var i=0,i0=this.length;i<i0;i++)
            {
                var element=this.get(i);
                if (element.Wilq32 && element.Wilq32.PhotoEffect) {
                    clearTimeout(element.Wilq32.PhotoEffect._timer);
                }
            }
        }
    });

// Library agnostic interface

    Wilq32=window.Wilq32||{};
    Wilq32.PhotoEffect=(function(){
        if (supportedCSS) {
            return function(img,parameters){
                img.Wilq32 = {
                    PhotoEffect: this
                };

                this._img = this._rootObj = this._eventObj = img;
                this._handleRotation(parameters);
            }
        } else {
            return function(img,parameters) {
                // Make sure that class and id are also copied - just in case you would like to refeer to an newly created object
                this._img = img;

                this._rootObj=document.createElement('span');
                this._rootObj.style.display="inline-block";
                this._rootObj.Wilq32 =
                    {
                        PhotoEffect: this
                    };
                img.parentNode.insertBefore(this._rootObj,img);

                if (img.complete) {
                    this._Loader(parameters);
                } else {
                    var self=this;
                    // TODO: Remove jQuery dependency
                    jQuery(this._img).bind("load", function()
                    {
                        self._Loader(parameters);
                    });
                }
            }
        }
    })();

    Wilq32.PhotoEffect.prototype={
        _setupParameters : function (parameters){
            this._parameters = this._parameters || {};
            if (typeof this._angle !== "number") this._angle = 0 ;
            if (typeof parameters.angle==="number") this._angle = parameters.angle;
            this._parameters.animateTo = (typeof parameters.animateTo==="number") ? (parameters.animateTo) : (this._angle);

            this._parameters.step = parameters.step || this._parameters.step || null;
            this._parameters.easing = parameters.easing || this._parameters.easing || function (x, t, b, c, d) { return -c * ((t=t/d-1)*t*t*t - 1) + b; }
            this._parameters.duration = parameters.duration || this._parameters.duration || 1000;
            this._parameters.callback = parameters.callback || this._parameters.callback || function(){};
            if (parameters.bind && parameters.bind != this._parameters.bind) this._BindEvents(parameters.bind);
        },
        _handleRotation : function(parameters){
            this._setupParameters(parameters);
            if (this._angle==this._parameters.animateTo) {
                this._rotate(this._angle);
            }
            else {

                this._animateStart();
            }
        },

        _BindEvents:function(events){
            if (events && this._eventObj)
            {
                // Unbinding previous Events
                if (this._parameters.bind){
                    var oldEvents = this._parameters.bind;
                    for (var a in oldEvents) if (oldEvents.hasOwnProperty(a))
                    // TODO: Remove jQuery dependency
                        jQuery(this._eventObj).unbind(a,oldEvents[a]);
                }

                this._parameters.bind = events;
                for (var a in events) if (events.hasOwnProperty(a))
                // TODO: Remove jQuery dependency
                    jQuery(this._eventObj).bind(a,events[a]);
            }
        },

        _Loader:(function()

        {
            if (IE)
                return function(parameters)
                {
                    var width=this._img.width;
                    var height=this._img.height;
                    this._img.parentNode.removeChild(this._img);

                    this._vimage = this.createVMLNode('image');
                    this._vimage.src=this._img.src;
                    this._vimage.style.height=height+"px";
                    this._vimage.style.width=width+"px";
                    this._vimage.style.position="absolute"; // FIXES IE PROBLEM - its only rendered if its on absolute position!
                    this._vimage.style.top = "0px";
                    this._vimage.style.left = "0px";

                    /* Group minifying a small 1px precision problem when rotating object */
                    this._container =  this.createVMLNode('group');
                    this._container.style.width=width;
                    this._container.style.height=height;
                    this._container.style.position="absolute";
                    this._container.setAttribute('coordsize',width-1+','+(height-1)); // This -1, -1 trying to fix ugly problem with small displacement on IE
                    this._container.appendChild(this._vimage);

                    this._rootObj.appendChild(this._container);
                    this._rootObj.style.position="relative"; // FIXES IE PROBLEM
                    this._rootObj.style.width=width+"px";
                    this._rootObj.style.height=height+"px";
                    this._rootObj.setAttribute('id',this._img.getAttribute('id'));
                    this._rootObj.className=this._img.className;
                    this._eventObj = this._rootObj;
                    this._handleRotation(parameters);
                }
            else
                return function (parameters)
                {
                    this._rootObj.setAttribute('id',this._img.getAttribute('id'));
                    this._rootObj.className=this._img.className;

                    this._width=this._img.width;
                    this._height=this._img.height;
                    this._widthHalf=this._width/2; // used for optimisation
                    this._heightHalf=this._height/2;// used for optimisation

                    var _widthMax=Math.sqrt((this._height)*(this._height) + (this._width) * (this._width));

                    this._widthAdd = _widthMax - this._width;
                    this._heightAdd = _widthMax - this._height;	// widthMax because maxWidth=maxHeight
                    this._widthAddHalf=this._widthAdd/2; // used for optimisation
                    this._heightAddHalf=this._heightAdd/2;// used for optimisation

                    this._img.parentNode.removeChild(this._img);

                    this._aspectW = ((parseInt(this._img.style.width,10)) || this._width)/this._img.width;
                    this._aspectH = ((parseInt(this._img.style.height,10)) || this._height)/this._img.height;

                    this._canvas=document.createElement('canvas');
                    this._canvas.setAttribute('width',this._width);
                    this._canvas.style.position="relative";
                    this._canvas.style.left = -this._widthAddHalf + "px";
                    this._canvas.style.top = -this._heightAddHalf + "px";
                    this._canvas.Wilq32 = this._rootObj.Wilq32;

                    this._rootObj.appendChild(this._canvas);
                    this._rootObj.style.width=this._width+"px";
                    this._rootObj.style.height=this._height+"px";
                    this._eventObj = this._canvas;

                    this._cnv=this._canvas.getContext('2d');
                    this._handleRotation(parameters);
                }
        })(),

        _animateStart:function()
        {
            if (this._timer) {
                clearTimeout(this._timer);
            }
            this._animateStartTime = +new Date;
            this._animateStartAngle = this._angle;
            this._animate();
        },
        _animate:function()
        {
            var actualTime = +new Date;
            var checkEnd = actualTime - this._animateStartTime > this._parameters.duration;

            // TODO: Bug for animatedGif for static rotation ? (to test)
            if (checkEnd && !this._parameters.animatedGif)
            {
                clearTimeout(this._timer);
            }
            else
            {
                if (this._canvas||this._vimage||this._img) {
                    var angle = this._parameters.easing(0, actualTime - this._animateStartTime, this._animateStartAngle, this._parameters.animateTo - this._animateStartAngle, this._parameters.duration);
                    this._rotate((~~(angle*10))/10);
                }
                if (this._parameters.step) {
                    this._parameters.step(this._angle);
                }
                var self = this;
                this._timer = setTimeout(function()
                {
                    self._animate.call(self);
                }, 10);
            }

            // To fix Bug that prevents using recursive function in callback I moved this function to back
            if (this._parameters.callback && checkEnd){
                this._angle = this._parameters.animateTo;
                this._rotate(this._angle);
                this._parameters.callback.call(this._rootObj);
            }
        },

        _rotate : (function()
        {
            var rad = Math.PI/180;

            if (IE)
                return function(angle)
                {
                    this._angle = angle;
                    this._container.style.rotation=(angle%360)+"deg";
                }
            else if (supportedCSS)
                return function(angle){
                    this._angle = angle;
                    this._img.style[supportedCSS]="rotate("+(angle%360)+"deg)";
                }
            else
                return function(angle)
                {
                    this._angle = angle;
                    angle=(angle%360)* rad;
                    // clear canvas
                    this._canvas.width = this._width+this._widthAdd;
                    this._canvas.height = this._height+this._heightAdd;

                    // REMEMBER: all drawings are read from backwards.. so first function is translate, then rotate, then translate, translate..
                    this._cnv.translate(this._widthAddHalf,this._heightAddHalf);	// at least center image on screen
                    this._cnv.translate(this._widthHalf,this._heightHalf);			// we move image back to its orginal
                    this._cnv.rotate(angle);										// rotate image
                    this._cnv.translate(-this._widthHalf,-this._heightHalf);		// move image to its center, so we can rotate around its center
                    this._cnv.scale(this._aspectW,this._aspectH); // SCALE - if needed ;)
                    this._cnv.drawImage(this._img, 0, 0);							// First - we draw image
                }

        })()
    }

    if (IE)
    {
        Wilq32.PhotoEffect.prototype.createVMLNode=(function(){
            document.createStyleSheet().addRule(".rvml", "behavior:url(#default#VML)");
            try {
                !document.namespaces.rvml && document.namespaces.add("rvml", "urn:schemas-microsoft-com:vml");
                return function (tagName) {
                    return document.createElement('<rvml:' + tagName + ' class="rvml">');
                };
            } catch (e) {
                return function (tagName) {
                    return document.createElement('<' + tagName + ' xmlns="urn:schemas-microsoft.com:vml" class="rvml">');
                };
            }
        })();
    }

})(Zepto);
var pointerFlag=true;

$(function (){
    var rotateTimeOut = function (){

        $('#rotate').rotate({

            angle:0,

            animateTo:2160,

            duration:8000,

            callback:function (){

                alert('网络超时，请检查您的网络设置！');

            }

        });

    };

    var bRotate = false;

var prizeCtn=function (obj) {
    pointerFlag=true;
    var str='';
    str+=' <div class="prize-call-info" seller_id="'+obj.sellerId+'" type="'+obj.categoryFirstId+'" flex="dir:left main:center cross:center box:last">';
    str+='<div class="desc"  flex="dir:top main:left">';
    str+='<p class="desc1">恭喜您抽中'+obj.prizeType+'等奖</p>';
    str+='<p class="desc2">由'+obj.sellerName+'提供的'+obj.sellerPrize+'</p>';
    str+='</div>';
    str+='<p class="call-avatar"><img src="'+obj.headImg+'" alt=""></p>';
    str+='</div>';
    str+='<div class="call-text" flex="dir:top main:center">';
    str+='<p>有效期:一个月<br>请尽快到店领取</p>';
    str+='</div>';
    $("#prize-call").html(str);
    new OlderPop().show([".alpha",".fixed-wrap",".prize-suc"],true);
    new OlderPop().bindEvent(".prize-call-info","click",function () {
        new NativeFn().toSellerDetail({
            seller_id:parseInt($(".prize-call-info").attr("seller_id")),
            category_first_id:parseInt($(".prize-call-info").attr("type"))
        })
    });
    new OlderPop().bindEvent(".fixed-wrap","click",function () {
        new OlderPop().show([".alpha",".fixed-wrap",".prize-suc"],false);
        new OlderPop().offEvent(".fixed-wrap","click");
        new OlderPop().offEvent(".prize-call-info","click");
    })
};
    var rotateFn = function (awards, angles, obj){

        bRotate = !bRotate;

        $('#rotate').stopRotate();

        $('#rotate').rotate({

            angle:0,

            animateTo:angles+1800,

            duration:3000,

            callback:function (){
                $.ajax({
                    headers:{
                        "Content-Type":"application/json;charset=UTF-8"
                    },
                    url:"/base/user/UserAction_sendShortMessageTip",
                    type:"post",
                    data:JSON.stringify({
                        type:"奖品",
                        userPhone:utils.initMainInfo().user.phone,
                        userName:utils.initMainInfo().user.nickName,
                        seller:[{sellerName:obj.sellerName,sellerPhone:obj.sellerPhone}],
                        award:obj.prizeType,
                        gift:obj.sellerPrize
                    }),
                    dataType:"json",
                    success:function (result) {
                        if(result.retcode==0){
                            prizeCtn(obj);
                        }else {
                            new AlertPop({message:result.msg});
                        }
                    }
                });
                bRotate = !bRotate;
            }

        })

    };
    $('.pointer').click(function (){
      if(utils.initMainInfo().isApp){
          if(utils.initMainInfo().isToken){
              if(pointerFlag){
                  pointerFlag=false;
                  $.ajax({
                      headers:{
                          "Content-Type":"application/json;charset=UTF-8"
                      },
                      url:"/base/user/UserAction_isReceivePrice",
                      type:"post",
                      data:JSON.stringify({
                          "userPhone":utils.initMainInfo().user.phone,
                          "type":"奖品"
                      }),
                      dataType:"json",
                      success:function (result) {
                          if(result.retcode==0){
                              if(result.resp.value<=0){
                                  if(bRotate)return;
                                  var item = rnd(0,8);
                                  var prize=[
                                      {
                                          sellerName:"桐摄STUDIO京城人文摄影",
                                          sellerPhone:'18518781612',
                                          sellerId:8325,
                                          sellerPrize:"10寸定制工业风摆台一个",
                                          prizeType:"特",
                                          categoryFirstId:10,
                                          headImg:"../image/index/logo/tslogo.png"
                                      },
                                      {
                                          sellerName:"JULIA 茱麗亞",
                                          sellerPhone:'17346510530',
                                          sellerId:6621,
                                          sellerPrize:"JULIA_T恤衫一件",
                                          prizeType:"一",
                                          categoryFirstId:9,
                                          headImg:"../image/index/logo/julia.png"
                                      },
                                      {
                                          sellerName:'cinderella婚纱礼服定制店',
                                          sellerPhone:"13601008285",
                                          sellerId:8511,
                                          sellerPrize:"送土栽小绿植一盆",
                                          prizeType:"二",
                                          categoryFirstId:9,
                                          headImg:"../image/index/logo/cinderella.jpg"
                                      },
                                      {
                                          sellerName:"DREAM WEAVING婚纱礼服原创设计",
                                          sellerPhone:"18611056882",
                                          sellerId:8424,
                                          sellerPrize:"精美头纱一条",
                                          prizeType:"三",
                                          categoryFirstId:9,
                                          headImg:"../image/index/logo/dream_weaving.png"
                                      },
                                      {
                                          sellerName:"台湾HER Studio（翯）·精致婚纱礼服工作室",
                                          sellerPhone:"18600085599",
                                          sellerId:8504,
                                          sellerPrize:"到店即送台湾精品手工头纱一条",
                                          prizeType:"三",
                                          categoryFirstId:9,
                                          headImg:"../image/index/logo/her.jpg"
                                      }
                                  ];
                                  switch (item) {

                                      case 0:

                                          //var angle = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5,337.5];

                                          rotateFn(0, 337.5, prize[2]);

                                          break;

                                      case 1:

                                          //var angle = [26,88, 137, 185, 235, 287];

                                          rotateFn(1, 22.5, prize[2]);

                                          break;

                                      case 2:

                                          //var angle = [137, 185, 235, 287];

                                          rotateFn(2, 67.5, prize[1]);

                                          break;

                                      case 3:

                                          //var angle = [137, 185, 235, 287];

                                          rotateFn(3, 112.5, prize[1]);

                                          break;

                                      case 4:

                                          //var angle = [185, 235, 287];

                                          rotateFn(4, 157.5, prize[0]);

                                          break;

                                      case 5:

                                          //var angle = [235, 287];

                                          rotateFn(5, 202.5, prize[3]);

                                          break;

                                      case 6:

                                          //var angle = [287];

                                          rotateFn(6, 247.5, prize[3]);

                                          break;

                                      case 7:

                                          //var angle = [287];

                                          rotateFn(6, 292.5, prize[4]);

                                          break;
                                  }
                                  new NativeFn().countAll("luckyDrawClick");
                              }else {
                                  pointerFlag=true;
                                  new AlertPop({message:"已抽奖"})
                              }
                          }
                      }
                  })
              }

          }else {
              var older=new OlderPop({
                  callBack:submitLogin
              });
              older.showOlderPop();
          }


      }else {
          new NativeFn().openAPP();
      }
    });
});

function rnd(n, m){
    return Math.floor(Math.random()*(m-n+1)+n)
}
function submitLogin() {
    var _this=this;
    var obj={
        weddingHeader:{},
        body:{
            phone:$("#phone").val(),
            code:$("#code").val()
        }
    };
    $.ajax({
        headers:{
            "Content-Type":"application/json;charset=UTF-8"
        },
        url:"/base/user/UserAction_login",
        type:"post",
        data:JSON.stringify(obj),
        dataType:"json",
        success:function (result) {
            if(result.retcode==0){
                $("#phone").val('');
                $("#code").val('');
                $('.join-fill-code .disable').removeClass("get-code");
                $(".join-disable").removeClass("join-submit");
                if((utils.initMainInfo().isApp)){
                    if(utils.initMainInfo().isToken){
                        $(".button").removeClass("disable");
                    }else {
                        _this.flag=true;
                    }
                }
                _this.close&&_this.close();
                _this.Login(result.resp.user);
                //new AlertPop({message:"登录成功"});
                if(utils.initMainInfo().isToken){
                    new AlertPop({message:"登录成功了"});
                }
                window.location.reload();
            }else{
                $("#code").siblings(".error-msg").text(result.msg).css("visibility","visible")
            }
        }
    })
}
$(document).ready(function () {
    var older=new OlderPop({
        callBack:submitLogin
    });
    $(".role-entry").on("click",function () {
        older.show([".alpha",".role-box"],true);
        older.bindEvent(".role-box",'click',function () {
            older.show([".alpha",".role-box",false]);
            older.offEvent(".role-box","click");
        })
    });
    function secondKillCtn(obj) {
        var str="";
        str+='<div class="call-info" flex="dir:left main:center cross:center">';
        str+='<p class="call-avatar"><img src="'+obj.headImg+'" alt=""></p>';
        str+='<div flex="dir:top main:left">';
        str+='<p class="call-name">'+obj.name+'</p>';
        str+='<p class="call-all">'+obj.city+' | '+obj.type+' | '+obj.price+'</p>';
        str+='</div>';
        str+='</div>';
        str+='<div class="call-desc-box" flex="dir:top main:center">';
        str+='<p class="call-goods-info">'+obj.gift+'</p>';
        str+='<p class="call-desc">商家会于7个工作日内与您联系<br>一定要保持电话的畅通哦</p>';
        str+='</div>';
        $("#second-kill-call").html(str);
        new OlderPop().show([".alpha",".fixed-wrap",".second-kill-suc"],true);
        new OlderPop().bindEvent(".fixed-wrap","click",function () {
            new OlderPop().show([".alpha",".fixed-wrap",".second-kill-suc"],false);
            new OlderPop().offEvent(".fixed-wrap","click");
            new OlderPop().offEvent(".prize-call-info","click");
        })

    }
    $(".kill-btn").on("click",function () {
        var self=this;
        var obj={
            name:$(self).attr("name"),
            city:$(self).attr("city"),
            price:$(self).attr("price"),
            type:$(self).attr("type"),
            headImg:$(self).attr("logo"),
            gift:$(self).attr("gift"),
            phone:$(self).attr("phone"),
            number:$(self).attr("num")
        };
       if(utils.initMainInfo().isApp){
           if(utils.initMainInfo().isToken){
               var param={
                   type:"秒杀",
                   userPhone:utils.initMainInfo().user.phone,
                   userName:utils.initMainInfo().user.nickName,
                   sellerName:obj.name,
                   sellerPhone:obj.phone,
                   gift:obj.gift,
                   number:parseInt(obj.number)
               };
               //TODO：秒杀接口
               if($(self).hasClass("disable")){
                     return;
               }else {
                   $.ajax({
                       headers:{
                           "Content-Type":"application/json;charset=UTF-8"
                       },
                       url:"/base/user/UserAction_secKill",
                       type:"post",
                       data:JSON.stringify(param),
                       dataType:"json",
                       success:function (result) {
                           if(result.retcode==0){
                               if(result.resp.status==2){
                                   //TODO:秒杀成功
                                   secondKillCtn(obj);
                               }else if(result.resp.status==1){
                                   new AlertPop({message:"已秒杀过"});
                                   /*$(self).addClass("disable")*/
                               }else if(result.resp.status==0){
                                   //TODO:秒杀失败
                                   new AlertPop({message:"秒杀失败"});
                                   $(self).addClass("disable").text("已抢光")
                               }
                           }
                       }
                   })
               }
               new NativeFn().countAll("skillSecondClick",{"sellerId":$(self).attr("seller_id"),"sellerName":obj.name})
           }else {
               older.showOlderPop();
           }
       }else {
           new NativeFn().openAPP();
       }
    });
     $(".channel-wrap .channel-list").on("click",function () {
         var href=window.location.origin+"/app_h5"+$(this).attr("url");
         window.location.href=href;
         new NativeFn().countAll("openActivePage",{"H5Url":href});
     });
    var swiper = new Swiper('.swiper-container', {
        direction: 'vertical',
        autoplay: {
            delay: 3000,
            disableOnInteraction: false
        },
        loop:true,
        slidesPerView: "auto",
        observer:true,
        observeParents:true
    });
});