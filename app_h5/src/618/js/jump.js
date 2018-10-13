/**
 * Created by YYBJ on 2018/6/14.
 */
function JumpPage() {

}
JumpPage.prototype={
    constructor:JumpPage,
    /**跳商家详情
     * @param self 绑定事件的元素本身
     * @param categoryFirstId 跳转商家的类别*/
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
    /*调用打电话*/
    toCallPhone:function(self){
        var _this=this;
        var nativeFn=new NativeFn();
        if(nativeFn.isApp){//app内
            var obj={
                phone:parseInt($(self).attr("tel"))
            };
            console.table(obj);
            nativeFn.toArticleDetail(obj);
        }else {
            window.location.href="tel:"+parseInt($(self).attr("tel"));
            nativeFn.openAPP();
        }
    },
}