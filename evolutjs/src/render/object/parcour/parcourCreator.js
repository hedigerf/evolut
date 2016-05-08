/**
 * Provides a parcour generator.
 *
 * @module renderer/object/parcour/parcourGenerator
 */

import { GameObject } from './../../../../lib/p2Pixi.es6';
import log4js from 'log4js';
import p2 from 'p2';
import PIXI from 'pixi.js';
import { texture } from '../../../util/path';

const logger = log4js.getLogger('ParcourCreator');

/**
 * Represents a parcour creator.
 * It is responsible for creating a visual appeareance of a parocur.
 */
export default class ParcourGenerator {

  /**
   * Creates a parcour generator instance.
   */
  constructor() {

    /**
     * Width of each element.
     *
     * @protected
     * @type {Number}
     */
    this.elementWidth = 1;
  }

  /**
  * Creates the Plane.
  *
  * @return {p2.Plane}
  */
  createPlane() {
    return new p2.Plane({});
  }

  /**
   * Creates a new height field.
   *
   * @protected
   * @param  {Array<Number>} heights
   * @return {p2.Heightfield}
   */
  createMountains(heights) {
    return new p2.Heightfield({
      heights,
      elementWidth: this.elementWidth,
      material: new p2.Material()
    });
  }

  /**
   * Create a parcour.
   *
   * @param {p2.World} world
   * @param {Object} parcour
   */
  createParcour(world, parcour) {
    if (logger.isDebugEnabled()) {
      logger.debug('ParcourCreator has started.');
    }
    const parcourGameObject = new GameObject(world);

    parcour.forEach(({ type, value }) => {
      if (type === 'mountain') {
        const bodyOptions = {
          collisionGroup: Math.pow(2, 0),
          collisionMask: Math.pow(2, 1)
        };

        const rockTexture = PIXI.Texture.fromImage(texture('rock.jpg'), false);

        const body = new p2.Body({
          position: [-10, 0],
          mass: 0
        });
        // TODO change position after one object is added
        parcourGameObject.addBody(body);
        parcourGameObject.addShape(body, this.createMountains(value), [0, 0], 0, bodyOptions, null, rockTexture);
      }
    });

    if (logger.isDebugEnabled()) {
      logger.debug('ParcourCreator ended.');
    }
  }

}
