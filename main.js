//Modules for electron
const { app, BrowserWindow, nativeImage } = require('electron')
//Global variables
const Config = require('./config')
//File and directory
const Path = require('path')
//Ico Default
const icon = nativeImage.createFromPath(Path.join(__dirname, './img/favicon.png'))

//Electron Window
const createWindow = () => {
  const win = new BrowserWindow({
    icon: icon,
    width: 1024,
    height: 768,
    minWidth: 800,
    minHeight: 600,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      devTools: false,
    },
  })
  if (Config.HOST) {
    win.loadURL(`http://${Config.HOST}:${Config.PORT}`)
  } else {
    win.loadFile('index.html')
  }
  win.maximize()
  win.show()
}

// Iniciar
app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

//Fechar
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
