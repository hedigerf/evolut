/**
 * Application controller module.
 *
 * @module applicationController
 */

/* eslint-env browser */

import './app/log';
import { debug, info } from './util/logUtil';
import config from './app/config';
import dumpCanvas from './render/canvas';
import InitialPopulationGenerator from './algorithm/population/initialPopulationGenerator';
import { ipcRenderer } from 'electron';
import jQuery from 'jquery';
import log4js from 'log4js';
import Mutator from './algorithm/mutation/mutator';
import { Range } from 'immutable';
import SettingsPanel from './settings/settingsPanel';
import SimulationWorld from './render/world/simulationWorld';
import TournamentBasedSelectionStrategy from './algorithm/selection/tournamentBasedSelectionStrategy';
import { World } from './app/ipc';

const logger = log4js.getLogger('applicationController');

let simulation;

function performSimulationPostprocessing(population) {
  info(logger, 'starting postprocessing');
  const selectionStrategy = new TournamentBasedSelectionStrategy(population, 10);
  const selected = selectionStrategy.select();
  const mutator = new Mutator();
  const mutated = mutator.mutate(selected);
  debug(logger, 'selected individuals size: ' + selected.individuals.size);
  simulation.addNewPopulation(mutated);
  simulation.generateParcour(config('parcour.startMaxSlope'), config('parcour.startHighestY'));
  info(logger, 'starting simulation for generation: ' + mutated.generationCount);
  simulation.run();
}

jQuery(() => {
  info(logger, 'starting application...');
  const initialPopulationGenerator = new InitialPopulationGenerator(Range(4, 9),
    config('algorithm.populationSize'));
  const initialPopulation = initialPopulationGenerator.generateInitialPopulation();
  simulation = new SimulationWorld(
    {
      mode: 'generator',
      maxSlope: config('parcour.startMaxSlope'),
      highestY: config('parcour.startHighestY')
    }, initialPopulation, performSimulationPostprocessing.bind(this));
  const settings = new SettingsPanel(simulation);
  settings.bindEvents();

  info(logger, 'application successfully started.');
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
  const fileName = Date.now().toString() + '.png';

  dumpCanvas(canvas, fileName);
});
