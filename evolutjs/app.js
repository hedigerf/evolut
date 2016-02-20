'use strict';

import {app, BrowserWindow} from 'electron';
import config from './config';

// Main application window
let mainWindow = null;

app.on('window-all-closed', () =>  {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {

  mainWindow = new BrowserWindow({
    width: config('window.width'),
    height: config('window.height')
  });

  mainWindow.loadUrl('file://' + __dirname + '/index.html');
  mainWindow.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
    app.exit(0);
  });
});
