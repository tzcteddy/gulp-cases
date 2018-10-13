/**
 * Created by YYBJ on 2018/8/3.
 */
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
var down=document.getElementById("down");
var url=window.location.href;
var query=url.myQueryURLParameter();
var href=down.getAttribute("href");
var promoteDown=document.getElementsByClassName("promote-down");
if(query.from){
    href=href+"&from="+query.from;
    down.href=href;
}
if(promoteDown&&promoteDown.length>0){
    for(var i=0;i<promoteDown.length;i++){
        var href=promoteDown[i].getAttribute("href");
        if(query.from){
            href=href+"&from="+query.from;
            promoteDown[i].href=href;
        }
    }
}
