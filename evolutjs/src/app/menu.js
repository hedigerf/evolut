/**
 * Defines the main application menu.
 *
 * @module app/menu
 */

import { app } from 'electron';
import Menu from 'menu';

import { World } from './ipc';

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
  },
  {
    label: 'Simulation',
    submenu: [
      {
        label: 'Next Generation',
        accelerator: 'CmdOrCtrl+F',
        click: (item, focusedWindow) => focusedWindow.webContents.send(World.NextGeneration)
      },
      {
        label: 'Pause / Resume',
        accelerator: 'CmdOrCtrl+P',
        click: (item, focusedWindow) => focusedWindow.webContents.send(World.TogglePause)
      },
      {
        label: 'Toggle Rendering',
        accelerator: 'CmdOrCtrl+V',
        click: (item, focusedWindow) => focusedWindow.webContents.send(World.ToggleRendering)
      },
      {
        type: 'separator'
      },
      {
        label: 'Save Screen',
        accelerator: 'CmdOrCtrl+S',
        click: (item, focusedWindow) => focusedWindow.webContents.send(World.SaveScreen)
      }
    ]
  }
];

Menu.setApplicationMenu(Menu.buildFromTemplate(template));
