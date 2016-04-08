/**
 * Provides a settings panel for the renderer.
 *
 * @module settings/SettingsPanel
 */

import jQuery from 'jquery';
import log4js from 'log4js';
import p2 from 'p2';

const logger = log4js.getLogger('SettingsPanel');

export default class SettingsPanel {

  constructor(game) {
    this.world = game.world;
    this.game = game;
  }

  /*
  * Bind all events on the related HTML elements (Simulation Settings)
  */
  bindEvents() {
    jQuery('#paused').on('change', () => {
      logger.debug('pause toggled');
      this.game.pauseToggle();
    });
    jQuery('#gravityX').on('change', () => {
      const newGravityX = jQuery('#gravityX').val();
      logger.debug('new gravity x: ' + newGravityX);
      this.world.gravity = p2.vec2.fromValues(newGravityX, this.world.gravity[1]);
    });
    jQuery('#gravityY').on('change', () => {
      const newGravityY = jQuery('#gravityY').val();
      logger.debug('new gravity y: ' + newGravityY);
      this.world.gravity = p2.vec2.fromValues(this.world.gravity[0], newGravityY);
    });
  }

}
