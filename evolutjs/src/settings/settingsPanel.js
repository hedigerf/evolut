'use strict';

var jQuery = require('jquery');
var p2 = require('p2');
var log4js = require('log4js');
var logger = log4js.getLogger('SettingsPannel');


module.exports =
  class SettingsPannel {
    constructor(game) {
      this.world = game.world;
      this.game = game;
    }

    /*
    * Bind all events on the related HTML elements (Simulation Settings)
    */
    bindEvents() {
      jQuery("#paused").on("change", () => {
        logger.debug('pause toggled');
        return this.game.pauseToggle();
      });
      jQuery("#gravityX").on("change", () => {
        var newGravityX = jQuery("#gravityX").val();
        logger.debug("new gravity x: " + newGravityX);
        return this.world.gravity = p2.vec2.fromValues(newGravityX, this.world.gravity[1]);
      });
      return jQuery("#gravityY").on("change", () => {
        var newGravityY = jQuery("#gravityY").val();
        logger.debug("new gravity y: " + newGravityY);
        return this.world.gravity = p2.vec2.fromValues(this.world.gravity[0], newGravityY);
      });
    }
  };
