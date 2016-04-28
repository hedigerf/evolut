/**
 * Application controller module.
 *
 * @module applicationController
 */

/* eslint-env browser */

import './app/config';
import './app/log';
import { createTimePrefix } from './util/path';
import dumpCanvas from './render/canvas';
import { info } from './util/logUtil';
import { ipcRenderer } from 'electron';
import jQuery from 'jquery';
import { List } from 'immutable';
import log4js from 'log4js';
import SettingsPanel from './settings/settingsPanel';
import SimulationWorld from './render/world/simulationWorld';
import uuid from 'uuid';
import { World } from './app/ipc';

const workerId = uuid.v4();
const logger = log4js.getLogger('worker[' + workerId + ']');

let simulation = null;

function performSimulationPostprocessing(population) {
  const stringified = population.individuals.toArray().map((x) => JSON.stringify(x));
  ipcRenderer.send('work-finished', stringified);
}

ipcRenderer.on('receive-work', (event, individualsStringified, generationCount, { parcour }) => {
  info(logger, 'received work');
  const individuals = individualsStringified.map((x) => JSON.parse(x));
  const population = {individuals: List(individuals), generationCount};
  if (simulation === null) {
    jQuery(() => {
      simulation = new SimulationWorld(
        {
          parcour: JSON.parse(parcour),
          wokerId: workerId
        }, population, performSimulationPostprocessing.bind(this));
      const settings = new SettingsPanel(simulation);
      settings.bindEvents();

      info(logger, 'worker sucessfully started.');
    });
  } else {
    simulation.addNewPopulation(population);
    simulation.createParcour(JSON.parse(parcour));
    info(logger, 'starting simulation for generation: ' + generationCount);
    simulation.run();
  }
});
/**
 * IPC-Callback for the main process's menu item 'Next Generation'.
 * Aborts the current run of the simulation and proceeds to the next.
 */
ipcRenderer.on(World.NextGeneration, () => {
  simulation.runOver = true;
});

/**
 * IPC-Callback for the main process's menu item 'Pause / Resume'.
 * Halt/resume the current run.
 */
ipcRenderer.on(World.TogglePause, () => {
  simulation.pauseToggle();
});

/**
 * IPC-Callback for the main process's menu item 'Toggle Rendering'.
 * Shows/hides the phenotypes.
 */
ipcRenderer.on(World.ToggleRendering, () => {
  simulation.isRenderingEnabled = !simulation.isRenderingEnabled;
});

/**
 * IPC-Callback for the main process's menu item 'Save Screen'.
 * Saves the current content of the renderer process.
 */
ipcRenderer.on(World.SaveScreen, () => {

  const canvas = document.getElementById('viewport');
  const fileName = createTimePrefix() + '_screenshot.png';

  dumpCanvas(canvas, fileName);
});
