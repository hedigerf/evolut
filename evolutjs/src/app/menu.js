/**
 * Defines the main application menu.
 *
 * @module app/menu
 */

import { app } from 'electron';
import Menu from 'menu';

/**
 * Menu configuration.
 *
 * @type {Array<Object>}
 */
const template = [
  {
    label: 'Evolut',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click: (item, focusedWindow) => focusedWindow.webContents.reloadIgnoringCache()
      },
      {
        label: 'Toggle DevTools',
        accelerator: 'CmdOrCtrl+I',
        click: (item, focusedWindow) => focusedWindow.toggleDevTools()
      },
      {
        type: 'separator'
      },
      {
        label: 'Quit',
        accelerator: 'CmdOrCtrl+Q',
        click: () => app.quit()
      }
    ]
  }
];

Menu.setApplicationMenu(Menu.buildFromTemplate(template));
