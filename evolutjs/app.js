'use strict';

import {app, BrowserWindow} from 'electron';

// main application window
let mainWindow = null;

app.on('window-all-closed', () =>  {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720
  });

  mainWindow.loadUrl('file://' + __dirname + '/index.html');
  mainWindow.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
    app.exit(0);
  });
});
