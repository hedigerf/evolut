jQuery = require 'jquery'

{CarDemoGame} = require './src/render/world/demo'
{SettingsPannel} = require './src/settings/SettingsPannel'


jQuery ->
  game = new CarDemoGame()
  settingsPannel = new SettingsPannel(game.world)
  settingsPannel.bindEvents()
