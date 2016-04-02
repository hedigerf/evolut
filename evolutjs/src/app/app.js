/**
 * Defines the main application menu.
 *
 * @module app/app
 */

import { app, BrowserWindow } from 'electron';

import config from './config';
import './menu';

/**
 * Start page.
 *
 * @private
 * @type {String}
 */
const index = 'file://' + __dirname + '/../../index.html';

/**
 * Main window application handle.
 *
 * @private
 * @type {BrowserWindow}
 */
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

  mainWindow.loadURL(index);
  mainWindow.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
    app.exit(0);
  });

});
