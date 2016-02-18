var jQuery = require('jquery');
var log4js = require('log4js');

var CarDemoGame = require('./render/world/demo');
var SettingsPannel = require('./settings/settingsPanel');

log4js.configure('log4js.json');
var logger = log4js.getLogger('p2-shizzle');

jQuery(function() {
  logger.info('starting application...');
  var game = new CarDemoGame();
  var settingsPannel = new SettingsPannel(game);
  settingsPannel.bindEvents();
  return logger.info('application successfully started.');
});
