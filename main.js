//Modules for electron
const { app, BrowserWindow, nativeImage } = require('electron')
//Import path and fs
const Path = require('path')
const Fs = require('fs')
//Global variables
const HOST = Fs.readFileSync(Path.resolve(__dirname, 'config-url.txt'), 'utf8')
//Verificar se URL é valida
const regExp = new RegExp('^((http|https)://)[-a-zA-Z0-9@:%._\\+~#?&//=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)$')
//Ico Default
const icon = nativeImage.createFromPath(Path.join(__dirname, 'public/img/favicon.png'))

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
  if (HOST && regExp.test(HOST)) {
    win.loadURL(HOST)
  } else {
    win.loadFile(Path.join(__dirname, 'view/index.html'))
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
