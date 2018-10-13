/**
 * Created by YYBJ on 2018/4/18.
 */
var gulp=require('gulp');
/*var babel=require("gulp-babel");
 var browserify=require("browserify");*/
var gulpif = require('gulp-if');
var htmlmin = require('gulp-htmlmin');
var uglify = require('gulp-uglify');//压缩js
var cleanCSS = require('gulp-clean-css');//压缩css
var minifyCSS=require("gulp-minify-css");
var imageMin = require('gulp-imagemin');//压缩图片
var pngquant = require('imagemin-pngquant');//深度压缩
var changed = require('gulp-changed'); // 只操作有过修改的文件
var livereload = require('gulp-livereload'); // 网页自动刷新（文件变动后即时刷新页面）
var webserver = require('gulp-webserver'); // 本地服务器
var clean = require('gulp-clean'); // 文件清理
var proxy = require("http-proxy-middleware");
var sourcemaps = require('gulp-sourcemaps');//来源地图，调试用
var babel = require('gulp-babel');


var srcDir={
    html:'./src/**/*.html',
    js:'./src/**/js/*.js',
    css:'./src/**/css/*.css',
    image:'./src/**/image/**/*.*'
};
var distDir={
    html:'../../pro/app_h5/**/*.html',
    js:'../../pro/app_h5/**/js/*.js',
    css:'../../pro/app_h5/**/css/*.css',
    image:'../../pro/app_h5/**/image/**/*.*'
};
/*=====HTML=====*/
gulp.task('Html',function(){
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: false,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: false,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: false,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: false,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    gulp.src(srcDir.html)
        .pipe(changed( distDir.html ))
        .pipe(htmlmin(options))
        .pipe(gulp.dest('../../pro/app_h5'))
});
/*====Js====*/
gulp.task("Js",function () {
    var condition = '.src/public/js/**.min.js';
    return gulp.src(srcDir.js)
        .pipe(changed( distDir.js ))
        .pipe(gulpif(condition, uglify())) //排除混淆关键字
        /*.pipe(uglify())*/
        .pipe(gulp.dest('../../pro/app_h5'))
});
/*=====CSS====*/
gulp.task('Css', function() {
    return  gulp.src(srcDir.css)
        .pipe(changed( distDir.css ))
        /*.pipe(sourcemaps.init())*/
        .pipe(minifyCSS({
            advanced: false,//类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
            compatibility: 'ie7',//保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
            keepBreaks: false,//类型：Boolean 默认：false [是否保留换行]
            keepSpecialComments: '*'
            //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
        }))
        /*.pipe(sourcemaps.write())*/
        .pipe(gulp.dest('../../pro/app_h5'));
});
/*======Img======*/
gulp.task('Img',function(){
    gulp.src(srcDir.image)
        .pipe(changed( distDir.image ))
        .pipe(imageMin({
            optimizationLevel:5,
            progressive: true,
            use: [pngquant()]
        }))
        .pipe(gulp.dest('../../pro/app_h5'))
    //.pipe(gulp.dest('./dist'))
});
gulp.task('clean', function() {
    return gulp.src(['../../pro/app_h5'], {read: false})
        .pipe(clean());
});
gulp.task('all',function () {
    return gulp.start('Html',"Js",'Css','Img')
});
// 注册任务
gulp.task('webserver', function() {
    gulp.src( './src') // 服务器目录（.代表根目录）
        .pipe(webserver({ // 运行gulp-webserver
            livereload: true, // 启用LiveReload
            open: true, // 服务器启动时自动打开网页
            host:'::',
            port:8081,
            proxies:[
                {
                    source:"/app",
                    target:"http://test.menghunli.com:8084/app"
                },
                /*{
                 source:"/base",
                 target:"http://test.menghunli.com/base"
                 },*/
                // {
                //     source:"/api",
                //     target:"http://123.56.154.68:8889/api"
                // },
                // {
                //     source:"/common",
                //     target:"http://47.95.145.155:8090/common"
                // },
                // {
                //     source:"/cms",
                //     target:"http://123.56.154.68:9004/cms"
                // }
            ]
        }));
});
// 监听任务
gulp.task('watch',function(){

    // 监听 html
    gulp.watch('./src/**/*.html', ['Html']);
    // 监听 scss
    gulp.watch('./src/**/css/*.css', ['Css']);
    // 监听 images
    gulp.watch('./src/**/image/**/*.{png,jpg,gif,svg}', ['Img']);
    // 监听 js
    gulp.watch('./src/**/js/*.js', ['Js']);
});

// 默认任务
gulp.task('default',['webserver','watch']);



