//Modules for electron
const { app, BrowserWindow, nativeImage } = require('electron')
//File and directory
const Path = require('path')
//Global variables
const Config = require(Path.join(__dirname, 'config.json'))
//Ico Default
const icon = nativeImage.createFromPath(Path.join(__dirname, 'img/favicon.png'))

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
    win.loadFile(Path.join(__dirname, 'index.html'))
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
