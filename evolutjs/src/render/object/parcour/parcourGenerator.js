/**
 * Provides a parcour generator.
 *
 * @module renderer/object/parcour/parcourGenerator
 */

import Immutable from 'immutable';
import log4js from 'log4js';
import p2 from 'p2';
import P2Pixi from './../../../../lib/p2Pixi.es6';
import path from 'path';
import PIXI from 'pixi.js';
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
    return new p2.Plane({});
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
   * @param {Number} y Height field index
   * @param {Number} maxSlope
   * @param {Number} highestY
   * @return {Number}
   */
  toHeight(y, maxSlope, highestY) {
    const positive = random.integer(0, 1);
    if (positive === 1) {
      const newY = y + random.real(0, maxSlope, true);
      // If highestY is reached generate a flat top
      if (newY > highestY) {
        return y;
      }
      return newY;
    }
    const newY = y + random.real(-maxSlope, 0);
    // Same for highest negative Y
    if (newY < (highestY * -1)) {
      return y;
    }
    return newY;
  }

  createMontains(length, maxSlope, highestY) {
    const range = Immutable.Range(0, length);
    const record = { lastY: 0, heights: Immutable.List.of() };
    const res = range.reduce((result) => {
      const y = this.toHeight(result.lastY, maxSlope, highestY);
      return { lastY: y, heights: result.heights.push(y) };
    }, record);
    const heights = res.heights.toArray();
    return new p2.Heightfield({
      heights,
      elementWidth: this.elementWidth,
      material: new p2.Material()
    });
  }

  generateParcour(world, maxSlope, highestY) {
    if (logger.isDebugEnabled()) {
      logger.debug('ParcourGenerator has started.');
    }
    const parcour = new P2Pixi.GameObject(world);
    const bodyOptions = {
      collisionGroup: Math.pow(2, 0),
      collisionMask: Math.pow(2, 1)
    };

    const rockTexture = PIXI.Texture.fromImage(this.rockTexturePath(), false);

    const body = new p2.Body({
      position: [-10, 0],
      mass: 0
    });

    parcour.addBody(body);
    parcour.addShape(body, this.createMontains(500, maxSlope , highestY), [0, 0], 0, bodyOptions, null, rockTexture);

    if (logger.isDebugEnabled()) {
      logger.debug('Parcourgeneration ended.');
    }
  }


}
