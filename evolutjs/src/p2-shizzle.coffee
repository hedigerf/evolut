jQuery = require 'jquery'
log4js = require 'log4js'

CarDemoGame = require './src/render/world/demo'
SettingsPannel = require './src/settings/settingsPanel'

log4js.configure('log4js.json')
logger = log4js.getLogger('p2-shizzle')

jQuery ->
  logger.info('starting application...')
  game = new CarDemoGame
  settingsPannel = new SettingsPannel game
  settingsPannel.bindEvents()
  logger.info('application successfully started.')
