jQuery = require 'jquery'

class SettingsPannel
  constructor: (game) ->
    @world = game.world
    @game = game

  ###
  * Bind all events on the related HTML elements (Simulation Settings)
  ###
  bindEvents: ->
    jQuery("#paused").on "change", =>
      @game.pauseToggle()

root = exports ? this
root.SettingsPannel = SettingsPannel
