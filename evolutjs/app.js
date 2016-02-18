'use strict';
let app = require('app');
let BrowserWindow = require('browser-window');
console.log('apped');
// main application window
let mainWindow = null;

app.on('window-all-closed', () =>  {
  if (process.platform !== 'darwin') {
    return app.quit();
  }
});

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    'web-preferences':
      {webgl: true}


  });mainWindow.loadUrl('file://' + __dirname + '/index.html');
  mainWindow.openDevTools();

  return mainWindow.on('closed', () => {
    mainWindow = null;
    return app.exit(0);
  });
});
