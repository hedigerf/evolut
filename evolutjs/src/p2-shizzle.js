'use strict';

import jQuery from 'jquery';
import log4js from 'log4js';

import SimulationWorld from './render/world/simulationWorld';
import CarDemoGame from './render/world/demo';
import SettingsPanel from './settings/settingsPanel';

log4js.configure('log4js.json');
const logger = log4js.getLogger('p2-shizzle');

jQuery(() => {

  logger.info('starting application...');
  const game = new SimulationWorld('flat',{generationCount: 1});
  //const game = new CarDemoGame();
  const settings = new SettingsPanel(game);
  settings.bindEvents();

  logger.info('application successfully started.');
});
