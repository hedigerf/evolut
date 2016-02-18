'use strict';
let jQuery = require('jquery');
let log4js = require('log4js');

let CarDemoGame = require('./render/world/demo');
let SettingsPannel = require('./settings/settingsPanel');

log4js.configure('log4js.json');
let logger = log4js.getLogger('p2-shizzle');

jQuery(() => {
  logger.info('starting application...');
  let game = new CarDemoGame();
  let settingsPannel = new SettingsPannel(game);
  settingsPannel.bindEvents();
  return logger.info('application successfully started.');
});
