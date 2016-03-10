'use strict';

import jQuery from 'jquery';
import log4js from 'log4js';
import config from '../config';
import Immutable from 'immutable';

import SimulationWorld from './render/world/simulationWorld';
import SettingsPanel from './settings/settingsPanel';
import InitialPopulationGenerator from './algorithm/population/initialPopulationGenerator';

log4js.configure('log4js.json');
const logger = log4js.getLogger('p2-shizzle');

jQuery(() => {
  logger.info('starting application...');
  const initialPopulationGenerator = new InitialPopulationGenerator(Immutable.Range(4,8),
    config('algorithm.populationSize'));
  const initalPopulation = initialPopulationGenerator.generateInitialPopulation();
  const game = new SimulationWorld(
    {
      mode: 'generator',
      maxSlope: config('parcour.startMaxSlope'),
      highestY: config('parcour.startHighestY')
    },{generationCount: 1});
  // Const game = new CarDemoGame();
  const settings = new SettingsPanel(game);
  settings.bindEvents();

  logger.info('application successfully started.');
});
