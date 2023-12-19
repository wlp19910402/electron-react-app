

### 创建 react项目
$   npx create-react-app electron-react-app
安装 elctron @electron/remote electron-is-dev
$ cnpm i  elctron @electron/remote electron-is-dev --save-dev

** electron-is-dev 判断是否生产环境和开发环境

### 安装环境变量和命令方式
$ cnpm i concurrently wait-on cross-env --save-dev

** concurrently   连接多个命令 中间使用空格分开
** wait-on 等待某个结果执行之后再去执行后续的命令
** cross-env 跨平台的环境变量设置 根据环境变量设置关闭浏览器的窗口,直接在electron的应用窗口打开

package.json位置原本设置
```
 "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "dev": "electron ."
    //  "dev": "concurrently \"npm start\" \"electron .\""
    //  "dev": "concurrently \"npm start\" \" wait-on http://localhost:3000 && electron .\""
    //  "dev": "concurrently \"cross-env BROWSER=none npm start\" \" wait-on http://localhost:3000 && electron .\""

  },
```
### 安装UI库

$ cnpm i bootstrap style-components --save

** bootstrap:UI组件库 
** style-components : 自定义样式


