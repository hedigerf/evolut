jQuery = require 'jquery'

CarDemoGame = require './src/render/world/demo'
SettingsPannel = require './src/settings/settingsPanel'

jQuery ->
  game = new CarDemoGame
  settingsPannel = new SettingsPannel game
  settingsPannel.bindEvents()
