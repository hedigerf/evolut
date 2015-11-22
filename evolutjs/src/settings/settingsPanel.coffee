jQuery = require 'jquery'

class SettingsPannel
  constructor: (world) ->
    @world = world

  ###
  * Bind all events on the related HTML elements (Simulation Settings)
  ###
  bindEvents: ->
    jQuery("#paused").on "change", ->
      word.paused = this.checked

root = exports ? this
root.SettingsPannel = SettingsPannel
