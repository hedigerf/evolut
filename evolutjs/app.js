'use strict';

import { app, BrowserWindow } from 'electron';
import config from './config';
import Menu from 'menu';

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

const template = [
  {
    label: 'Evolut',
    submenu: [
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click: () => app.quit()
      },
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'Command+R',
        click: () => BrowserWindow.getFocusedWindow().reloadIgnoringCache()
      },
      {
        label: 'Toggle DevTools',
        accelerator: 'Command+I',
        click: () => BrowserWindow.getFocusedWindow().toggleDevTools()
      }
    ]
  }
];

Menu.setApplicationMenu(Menu.buildFromTemplate(template));
