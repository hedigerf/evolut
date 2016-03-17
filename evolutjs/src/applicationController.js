'use strict';

import jQuery from 'jquery';
import log4js from 'log4js';
import config from '../config';
import {Range} from 'immutable';

import SimulationWorld from './render/world/simulationWorld';
import SettingsPanel from './settings/settingsPanel';
import InitialPopulationGenerator from './algorithm/population/initialPopulationGenerator';
import {debug, info} from './util/logUtil';
import TournamentBasedSelectionStrategy from './algorithm/selection/tournamentBasedSelectionStrategy';

log4js.configure('log4js.json');
const logger = log4js.getLogger('applicationController');

let simulation;

function performSimulationPostprocessing(population) {
  info(logger, 'starting postprocessing');
  const selectionStrategy = new TournamentBasedSelectionStrategy(population, 10);
  const selected = selectionStrategy.select();
  debug(logger, 'selected individuals size: ' + selected.individuals.size);
  simulation.clear();
  simulation.reset();
  simulation.drawCircles();
  // Graphical objects need to be constructed freshly
  // Simulation.addNewPopulation(selected);
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
