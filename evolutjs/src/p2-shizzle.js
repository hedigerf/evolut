'use strict';

import jQuery from 'jquery';
import log4js from 'log4js';

import CarDemoGame from './render/world/demo';
import SettingsPannel from './settings/settingsPanel';

log4js.configure('log4js.json');
const logger = log4js.getLogger('p2-shizzle');

jQuery(() => {

  logger.info('starting application...');

  const game = new CarDemoGame();
  const settingsPannel = new SettingsPannel(game);
  settingsPannel.bindEvents();

  logger.info('application successfully started.');
});
