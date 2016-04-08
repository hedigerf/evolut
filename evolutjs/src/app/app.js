/**
 * Defines the main application menu.
 * Runs within the main process.
 * The spawned window run each in a separate render process.
 *
 * @module app/app
 */

import './menu';
import { app, BrowserWindow } from 'electron';
import { path as appRoot } from 'app-root-path';
import config from './config';

/**
 * Start page.
 *
 * @private
 * @type {String}
 */
const index = 'file://' + appRoot + '/index.html';

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
    width: config('window:width'),
    height: config('window:height')
  });

  mainWindow.loadURL(index);
  // mainWindow.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
    app.exit(0);
  });

});
