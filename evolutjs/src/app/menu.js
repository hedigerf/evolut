/**
 * Defines the main application menu.
 *
 * @module app/menu
 */

import { app } from 'electron';
import Menu from 'menu';

// Main menu
const template = [
  {
    label: 'Evolut',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click: (item, focusedWindow) => focusedWindow.reloadIgnoringCache()
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
