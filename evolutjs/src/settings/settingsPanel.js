'use strict';

import jQuery from 'jquery';
import p2 from 'p2';
import log4js from 'log4js';

const logger = log4js.getLogger('SettingsPannel');

export default class SettingsPannel {

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
      this.game.pauseToggle();
    });
    jQuery("#gravityX").on("change", () => {
      let newGravityX = jQuery("#gravityX").val();
      logger.debug("new gravity x: " + newGravityX);
      this.world.gravity = p2.vec2.fromValues(newGravityX, this.world.gravity[1]);
    });
    return jQuery("#gravityY").on("change", () => {
      let newGravityY = jQuery("#gravityY").val();
      logger.debug("new gravity y: " + newGravityY);
      this.world.gravity = p2.vec2.fromValues(this.world.gravity[0], newGravityY);
    });
  }

}
