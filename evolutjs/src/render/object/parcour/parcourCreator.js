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

  createMontains(heights) {
    return new p2.Heightfield({
      heights,
      elementWidth: this.elementWidth,
      material: new p2.Material()
    });
  }

  createParcour(world, parcour) {
    if (logger.isDebugEnabled()) {
      logger.debug('ParcourCreator has started.');
    }
    const parcourGameObject = new GameObject(world);

    parcour.forEach(({type, value}) => {
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
        parcourGameObject.addShape(body, this.createMontains(value), [0, 0], 0, bodyOptions, null, rockTexture);
      }
    });

    if (logger.isDebugEnabled()) {
      logger.debug('ParcourCreator ended.');
    }
  }


}
