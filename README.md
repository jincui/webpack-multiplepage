# webpack-multipepage

use webpack to build multiple-page-static application with stylus and jade


```
- webpack-multiplepage
 + build
 - source
   - components   ＃组件
     - common
       + styles   #公共样式
     + header    #头部组件
     + footer    
     - layout    #布局组件
       index.js   ＃layout入口文件，,可导入依赖，及写一些逻辑代码
       layout.styl    #layout样式
       bg.png
       layout.jade   #页面布局jade，include了header.jade和footer.jade
   - pages    ＃页面
     + about   #关于模块
     + help    #帮助模块
     - index   #首页模块
       index.jade    #首页内容，extends layout.jade
       index.js    #首页入口文件,可导入依赖，及写一些逻辑代码
       index.styl    #首页样式
 .eslintrc
 .eslintignore
 .gitignore
 webpack.config.js    #webpack配置文件
 package.json
 README.md

```

## build result
```
- build
  - assets    #字体，图片资源
    + fonts
    + images
  - common    #公用文件，包含了第三方依赖和抽离出来的公共代码
    common.****.js  
    common.****.css
  - about   ＃about模块
    about.****.js   
    about.****.css
    about.html
  + help
  - index
    index.****.js
    index.****.css
  index.html    #index首页置于根目录，方便webpack监听
```

## Detail description
[webpack构建静态多页应用项目框架](http://xjinjin.net/2016/08/20/webpack-multiple-page-static/)

## Reference
- [angular1-webpack-starter](https://github.com/PinkyJie/angular1-webpack-starter)
- [webpack-MultiPage-static](https://github.com/vhtml/webpack-MultiPage-static)
