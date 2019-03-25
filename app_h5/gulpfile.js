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
var gulpSequence = require('gulp-sequence');//按顺序执行任务
var proxy = require("http-proxy-middleware");
var sourcemaps = require('gulp-sourcemaps');//来源地图，调试用
var babel = require('gulp-babel');
var sass = require('gulp-sass');
sass.compiler = require('node-sass');
var autoprefixer = require("gulp-autoprefixer");

var srcDir=null;
var distDir=null;
var outDir='../../pro/app_h5';
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
    .pipe(gulp.dest(outDir))
});
/*====Js====*/
gulp.task("Js",function () {
  var condition = function(file){
    if(/\.min/.test(file.path)||/weixin-js-sdk/.test(file.path)){
      return false;
    }else{
      return true;
    }
  };
  return gulp.src(srcDir.js)
    .pipe(changed( distDir.js ))
    //.pipe(babel())
    .pipe(gulpif(condition, babel())) //排除混淆关键字
    .pipe(gulpif(condition, uglify())) //排除混淆关键字
    //.pipe(uglify())
    .pipe(gulp.dest(outDir))
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
    .pipe(gulp.dest(outDir));
});
/*=====Sass====*/
gulp.task('Sass', function () {
  return gulp.src(srcDir.sass)
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(gulp.dest(outDir));
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
    .pipe(gulp.dest(outDir))
  //.pipe(gulp.dest('./dist'))
});
/*======clean======*/
gulp.task('clean', function() {
  return gulp.src([outDir], {read: false})
    .pipe(clean({force:true}));
});
/*======setPath======*/
gulp.task('setPath',function () {
  srcDir={
    html:'./src/**/*.html',
    js:'./src/**/js/**/*.js',
    css:'./src/**/css/**/*.css',
    sass:'./src/**/css/**/*.scss',
    image:'./src/**/image/**/*.*'
  };
  distDir={
    html:'../../pro/app_h5/**/*.html',
    js:'../../pro/app_h5/**/js/*.js',
    css:'../../pro/app_h5/**/css/*.css',
    sass:'../../pro/app_h5/**/css/*.scss',
    image:'../../pro/app_h5/**/image/**/*.*'
  };
  outDir='../../pro/app_h5';
});
/*======setCurrentPath======*/
gulp.task('setCurrentPath',function () {
  var curPath="0313";
  srcDir={
    html:'./src/**/'+curPath+'/**/*.html',
    js:'./src/**/'+curPath+'/js/**/*.js',
    css:'./src/**/'+curPath+'/css/**/*.css',
    sass:'./src/**/'+curPath+'/css/**/*.scss',
    image:'./src/**/'+curPath+'/image/**/**.**'
  };
  distDir={
    html:'../../pro/app_h5/**/'+curPath+'/*.html',
    js:'../../pro/app_h5/**/'+curPath+'/js/*.js',
    css:'../../pro/app_h5/**/'+curPath+'/css/*.css',
    sass:'../../pro/app_h5/**/'+curPath+'/css/*.scss',
    image:'../../pro/app_h5/**/'+curPath+'/image/**.**'
  };
  outDir='../../pro/app_h5/';
});
/*======setPublicPath======*/
gulp.task('setPublicPath',function () {
  srcDir={
    js:'./src/public/**/*.js',
    css:'./src/public/**/*.css',
    sass:'./src/public/**/*.scss',
    image:'./src/public/**/**.**'
  };
  distDir={
    js:'../../pro/app_h5/public/**/*.js',
    css:'../../pro/app_h5/public/**/*.css',
    sass:'../../pro/app_h5/public/**/*.scss',
    image:'../../pro/app_h5/public/**/**.**'
  };
  outDir='../../pro/app_h5/public';
});

// 注册任务
gulp.task('webserver', function() {
  gulp.src( './src') // 服务器目录（.代表根目录）
    .pipe(webserver({ // 运行gulp-webserver
      livereload: true, // 启用LiveReload
      open: true, // 服务器启动时自动打开网页
      host:'::',
      port:8082,
      proxies:[
        /*{
            source:"/api",
            target:"http://192.168.119.26:8080/api"
        },*/
        {
          source:"/app",
          target:"http://47.95.145.155:8090/app"
        },
        /*{
            source:"/app",
            target:"http://www.testenv.menghunli.com/app"
        }*/
      ]
    }));
});
// 监听任务
gulp.task('watch',function(){

  // 监听 html
  gulp.watch('./src/**/*.html', ['Html']);
  // 监听 scss
  gulp.watch('./src/**/css/*.sass', ['Sass']);
  // 监听 css
  gulp.watch('./src/**/css/*.css', ['Css']);
  // 监听 images
  gulp.watch('./src/**/image/**/*.{png,jpg,gif,svg}', ['Img']);
  // 监听 js
  gulp.watch('./src/**/js/*.js', ['Js']);
});

// 默认任务
gulp.task('default',['webserver','watch']);
// 打包 全部内容
gulp.task('all',gulpSequence('clean','setPath','Html',"Js",'Sass','Css','Img'));
gulp.task('public',gulpSequence('clean','setPublicPath',"Js",'Sass','Css','Img'));
gulp.task('current',gulpSequence('clean','setCurrentPath','Html',"Js",'Sass','Css','Img','setPublicPath',"Js",'Sass','Css','Img'));

gulp.task('help',function () {
  console.log('----------------- 开发环境 -----------------');
  console.log('gulp default		开发环境（默认任务）');
  console.log('gulp Html		HTML处理');
  console.log('gulp Css		CSS处理');
  console.log('gulp Js		JS文件压缩');
  console.log('gulp Img		图片压缩');
  console.log('---------------- 发布环境 -----------------');
  console.log('gulp all		打包全部文件发布');
  console.log('gulp clean		清理文件');
  console.log('gulp setPath		设置全部文件路径');
  console.log('gulp setPublicPath		设置公共文件路径');
  console.log('gulp setCurrent		设置当前文件路径');
  console.log('gulp public		打包公共文件-public/');
  console.log('gulp current	  打包设置的当前文件');
  console.log('---------------------------------------------');
});
