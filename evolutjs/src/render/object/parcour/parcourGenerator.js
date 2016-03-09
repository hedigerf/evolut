'use strict';

import p2 from 'p2';
import path from 'path';
import PIXI from 'pixi.js';
import log4js from 'log4js';
import P2Pixi from './../../../../lib/p2Pixi';
import Random from 'random-js';


const random = new Random(Random.engines.mt19937().autoSeed());
const logger = log4js.getLogger('ParcourGenerator');

/**
 * Is able to generate a parcour
 */
export default class ParcourGenerator {
  constructor() {
    this.elementWidth = 1;
  }

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

  /**
   * Returns a height for an element in a height field
   *
   * @param  {Number} i Height field index
   * @return {Number}
   */
   toHeight(i) {
    const cosValue = random.real(0, 2 * Math.PI,true);
    const cos = (a) => {
      return Math.cos(a);
    };
    return cos(cosValue);
  }


  createHeightField(maxSlope) {

    const heights = [];
    let i = 1;
    let lastX, lastY;
    while (i <= 500) {
      const x = i++;
      let valid = false;
      let y;
      while (!valid) {
        y = this.toHeight(x);
        const m = Math.abs((lastX - x) / (lastY - y));
        if (lastX !== undefined && lastY !== undefined) {
          valid = m <= maxSlope;
        }else {
          valid = true;
        }
        if (logger.isDebugEnabled() && valid) {
          logger.debug('Found: ' + x + '/' + y   + ' MaxSlope: ' + maxSlope + ' m: ' + m);
        }
      }
      lastX = x;
      lastY = y;
      heights.push(y);
    }

    return new p2.Heightfield({
      heights,
      elementWidth: this.elementWidth,
      material: new p2.Material()
    });
  }

  generateParcour(world,maxSlope,highestY) {
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
    }else if (maxSlope > 0) {
      parcour.addBody(body);
      parcour.addShape(body, this.createHeightField(maxSlope), [0, 0], 0, bodyOptions, null, rockTexture);
    }
    if (logger.isDebugEnabled()) {
      logger.debug('Parcourgeneration ended.');
    }
  }


}
