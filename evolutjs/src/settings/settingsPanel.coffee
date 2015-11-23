jQuery = require 'jquery'
p2 = require 'p2'
log4js = require 'log4js'
logger = log4js.getLogger('SettingsPannel')


module.exports =
  class SettingsPannel
    constructor: (game) ->
      @world = game.world
      @game = game

    ###
    * Bind all events on the related HTML elements (Simulation Settings)
    ###
    bindEvents: ->
      jQuery("#paused").on "change", =>
        logger.debug 'pause toggled'
        @game.pauseToggle()
      jQuery("#gravityX").on "change", =>
        newGravityX = jQuery("#gravityX").val()
        logger.debug "new gravity x: " + newGravityX
        @world.gravity = p2.vec2.fromValues newGravityX, @world.gravity[1]
      jQuery("#gravityY").on "change", =>
        newGravityY = jQuery("#gravityY").val()
        logger.debug "new gravity y: " + newGravityY
        @world.gravity = p2.vec2.fromValues @world.gravity[0], newGravityY
