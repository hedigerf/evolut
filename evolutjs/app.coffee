app = require 'app'
BrowserWindow = require 'browser-window'

# main application window
mainWindow = null

app.on 'window-all-closed', ->
  if process.platform != 'darwin'
    app.quit

app.on 'ready', ->
  mainWindow = new BrowserWindow {
    width: 1280,
    height: 720,
    'web-preferences': { webgl: true }
  }

  mainWindow.loadUrl 'file://' + __dirname + '/index.html'
  mainWindow.openDevTools

  mainWindow.on 'closed', ->
    mainWindow = null
    app.exit 0
