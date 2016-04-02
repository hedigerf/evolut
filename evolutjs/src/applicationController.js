/**
 * Application controller module.
 *
 * @module applicationController
 */

import { ipcRenderer } from 'electron';
import jQuery from 'jquery';
import log4js from 'log4js';
import { Range } from 'immutable';

import config from './app/config';
import SimulationWorld from './render/world/simulationWorld';
import SettingsPanel from './settings/settingsPanel';
import InitialPopulationGenerator from './algorithm/population/initialPopulationGenerator';
import Mutator from './algorithm/mutation/mutator';
import {debug, info} from './util/logUtil';
import TournamentBasedSelectionStrategy from './algorithm/selection/tournamentBasedSelectionStrategy';

log4js.configure('config/log4js.json');
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
  simulation.drawPhenotypes();
  simulation.generateParcour(config('parcour.startMaxSlope'), config('parcour.startHighestY'));
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
ipcRenderer.on('world-next-generation', () => {
  simulation.runOver = true;
});

/**
 * IPC-Callback for the main process's menu item 'Pause / Resume'.
 * Halt/resume the current run.
 */
ipcRenderer.on('world-toggle-pause', () => {
  simulation.pauseToggle();
});

/**
 * IPC-Callback for the main process's menu item 'Toggle Rendering'.
 * Shows/hides the phenotypes.
 */
ipcRenderer.on('world-toggle-rendering', () => {
  simulation.isRenderingEnabled = !simulation.isRenderingEnabled;
});
