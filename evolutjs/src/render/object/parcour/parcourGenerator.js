'use strict';

import p2 from 'p2';
import path from 'path';
import PIXI from 'pixi.js';
import log4js from 'log4js';
import P2Pixi from './../../../../lib/p2Pixi';

const logger = log4js.getLogger('ParcourGenerator');

/**
 * Is able to generate a parcour
 */
export default class ParcourGenerator {

  /**
  * Creates the Plane
  *
  * @return {Array<Number>}
  */
  createPlane() {

    return new p2.Plane({
    });
  }

  /**
   * Returns the path to a rock texture
   *
   * @return {String}
   */
  rockTexturePath() {
    return path.join(__dirname, '../../../..', 'assets/textures', 'rock.jpg');
  }

  generateParcour(world,maxSlope) {
    if (logger.isDebugEnabled()) {
      logger.debug('ParcourGenerator has started.');
    }
    const parcour = new P2Pixi.GameObject(world);
    const bodyOptions = {
      collisionGroup: 1,
      collisionMask: 2 // 1 | 2
    };

    const rockTexture = PIXI.Texture.fromImage(this.rockTexturePath(), false);

    const body = new p2.Body({
      position: [-75, -10],
      mass: 0
    });


    if (maxSlope === 0) {
      if (logger.isDebugEnabled()) {
        logger.debug('generating flat parcour');
      }
      parcour.addBody(body);
      parcour.addShape(body, this.createPlane(), [0, 0], 0, bodyOptions, null, rockTexture);
    }
    if (logger.isDebugEnabled()) {
      logger.debug('Parcourgeneration ended.');
    }
  }


}
