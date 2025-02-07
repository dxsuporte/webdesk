const start = async () => {
  /* Start Functions */

  //Import path and fs
  const Path = require('node:path')
  const Fs = require('node:fs')

  //Se o diretório for compilado com ASAR
  if (__dirname.includes('app.asar')) {
    //Variável do diretório do ASAR
    let ASAR_FILE = `${process.env.HOME}/.webdesk/`
    //Se for Windows
    if (process.platform === 'win32') ASAR_FILE = `${process.env.APPDATA}/.webdesk/`
    //Se não existir, cria a pasta
    if (!Fs.existsSync(ASAR_FILE)) Fs.mkdirSync(ASAR_FILE, { recursive: true })
    //Global BASE_FILE
    process.env.BASE_FILE = Path.join(`${ASAR_FILE}config-url.txt`)
    //Se não existir, cria o aquivo
    if (!Fs.existsSync(process.env.BASE_FILE)) Fs.writeFileSync(process.env.BASE_FILE, '')
    //Global BASE_HOST
    process.env.BASE_HOST = Fs.readFileSync(Path.resolve(process.env.BASE_FILE), 'utf8')
  } else {
    //Global BASE_FILE e BASE_HOST
    process.env.BASE_FILE = Path.join(__dirname, 'config-url.txt')
    process.env.BASE_HOST = Fs.readFileSync(Path.resolve(__dirname, 'config-url.txt'), 'utf8')
  }

  //Modules for electron and ico Default
  const { app, BrowserWindow, nativeImage } = require('electron/main')
  const Icon = nativeImage.createFromPath(Path.join(__dirname, 'public/img/favicon.png'))

  //Index Window
  const createIndex = async () => {
    const win = new BrowserWindow({
      icon: Icon,
      width: 1024,
      height: 768,
      minWidth: 800,
      minHeight: 600,
      show: false,
      autoHideMenuBar: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        devTools: true,
        preload: Path.join(__dirname, 'view/preload.js'),
      },
    })
    //Validação de URL
    const regExp = new RegExp('^((http|https)://)(?:w{1,3}.)?[^s.]+(?:.[a-z]+)*(?::d+)?(?![^<]*(?:</w+>|/?>))(.*?)(/)?$')
    //Se BASE_HOST existir e se for uma URL valida
    if (process.env.BASE_HOST && regExp.test(process.env.BASE_HOST)) {
      await win.loadURL(process.env.BASE_HOST)
    } else {
      await win.loadFile(Path.join(__dirname, 'view/index.html'))
    }
    win.maximize()
    win.show()
  }

  // Iniciar
  await app.whenReady().then(async () => {
    await createIndex()
    app.on('activate', async () => {
      if (BrowserWindow.getAllWindows().length === 0) await createIndex()
    })
  })

  //Fechar
  app.on('window-all-closed', async () => {
    if (process.platform !== 'darwin') app.quit()
  })

  /* End of Functions */
}
start()
