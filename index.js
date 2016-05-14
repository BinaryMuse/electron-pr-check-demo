import path from 'path'
import { app, BrowserWindow, Tray } from "electron"
import Positioner from "electron-positioner"

let trayIcon = null
let mainWindow = null
app.dock.hide()

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    frame: false,
    show: false,
    transparent: true,
  })
  const positioner = new Positioner(mainWindow)
  mainWindow.loadURL(`file://${__dirname}/renderer/index.html`)

  mainWindow.on('blur', () => {
    mainWindow.hide()
  })

  const iconPath = path.resolve('..', __dirname, 'tray-icon.png')
  trayIcon = new Tray(iconPath)
  trayIcon.on('click', (evt, bounds) => {
    positioner.move('trayCenter', bounds)
    mainWindow.isFocused() ? mainWindow.hide() : mainWindow.show()
  })
})
