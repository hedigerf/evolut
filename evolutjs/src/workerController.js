/**
 * Application controller module.
 *
 * @module workerController
 */

/* eslint-env browser */

import './app/config';
import { Worker, World } from './app/ipc';
import { createTimePrefix } from './util/path';
import dumpCanvas from './render/canvas';
import { getLogger } from './app/log';
import { info } from './util/logUtil';
import { ipcRenderer } from 'electron';
import jQuery from 'jquery';
import { List } from 'immutable';
import { mutateGenotype } from './algorithm/mutation/mutator';
import SettingsPanel from './settings/settingsPanel';
import SimulationWorld from './render/world/simulationWorld';
import uuid from 'uuid';

/**
 * Worker id.
 *
 * @type {String}
 */
const workerId = uuid.v4();

/**
 * The configured logger for this worker.
 *
 * @type {Logger}
 */
const logger = getLogger('worker', workerId);

/**
 * The current simulation world of this worker.
 *
 * @type {SimulationWorld}
 */
let simulation = null;

/**
 * Sends the simulation results to the main process.
 *
 * @param {Population} population The population for this simulation
 */
function performSimulationPostprocessing(population) {
  const stringified = population.individuals.toArray().map((x) => JSON.stringify(x));
  ipcRenderer.send(Worker.Finished, stringified, workerId);
}

/**
 * IPC-Callback for the worker process when it receives work.
 */
ipcRenderer.on(Worker.Receive, (event, individualsStringified, generationCount, { parcour }) => {

  info(logger, 'received work');

  const individuals = individualsStringified.map((x) => JSON.parse(x));
  const population = { individuals: List(individuals), generationCount };

  if (simulation === null) {

    jQuery(() => {
      simulation = new SimulationWorld(
        {
          parcour: JSON.parse(parcour),
          workerId
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
 * IPC-Callback for the worker process when it receives work.
 */
ipcRenderer.on(Worker.MutationReceive, (event, individualsStringified, generationCount, {  }) => {
  const individuals = individualsStringified.map((x) => JSON.parse(x));
  const offsprings = individuals.map(mutateGenotype);
  const stringified = offsprings.map((x) => JSON.parse(x));
  ipcRenderer.send(Worker.MutationFinished, stringified);
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
