'use strict';

import jQuery from 'jquery';
import log4js from 'log4js';
import config from '../config';
import Immutable from 'immutable';

import SimulationWorld from './render/world/simulationWorld';
import SettingsPanel from './settings/settingsPanel';
import InitialPopulationGenerator from './algorithm/population/initialPopulationGenerator';
import {info} from './util/logUtil';

log4js.configure('log4js.json');
const logger = log4js.getLogger('applicationController');

let game;

function performSimulationPostprocessing(population) {
  info(logger,'starting postprocessing');
  game.clear();
  game.reset();
  game.drawCircles();
  game.generateParcour(config('parcour.startMaxSlope'),config('parcour.startHighestY'));
  game.run();
}

jQuery(() => {
  info(logger,'starting application...');
  const initialPopulationGenerator = new InitialPopulationGenerator(Immutable.Range(4,8),
    config('algorithm.populationSize'));
  const initalPopulation = initialPopulationGenerator.generateInitialPopulation();
  game = new SimulationWorld(
    {
      mode: 'generator',
      maxSlope: config('parcour.startMaxSlope'),
      highestY: config('parcour.startHighestY')
    },{generationCount: 1, individuals: null}, performSimulationPostprocessing.bind(this));
  // Const game = new CarDemoGame();
  const settings = new SettingsPanel(game);
  settings.bindEvents();

  info(logger,'application successfully started.');
});
