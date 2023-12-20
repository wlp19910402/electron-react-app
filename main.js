const { app, BrowserWindow } = require('electron')
const remote = require('@electron/remote/main')
const isDev = require('electron-is-dev')
let mainWindow
app
  .whenReady()
  .then(() => {
    remote.initialize() //子模块使用electron
    mainWindow = new BrowserWindow({
      x: 0,
      y: 0,
      width: 1024,
      height: 650,
      show: false,
      minWidth: 600,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    })
    const urlLocation = isDev ? 'http://localhost:3000/' : 'prodUrl'
    //注入页面内容
    mainWindow.loadURL(urlLocation)
    //页面加载完成后桌面应用启动
    mainWindow.on('ready-to-show', () => {
      mainWindow.show()
    })
    //关闭清空内容
    mainWindow.on('close', () => {
      mainWindow = null
    })
    //子模块使用electron
    remote.enable(mainWindow.webContents)
    //开发打开控制台
    isDev && mainWindow.webContents.openDevTools()
  })
  .catch((err) => {
    console.log(err)
  })

app.on('window-all-closed', () => {
  app.quit()
})
