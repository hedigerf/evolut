'use strict';

import p2 from 'p2';
import path from 'path';
import PIXI from 'pixi.js';

import P2Pixi from './../../../../lib/p2Pixi';

/**
 * Returns a height for an element in a height field
 *
 * @param  {Number} i Height field index
 * @return {Number}
 */
function toHeight(i) {
  const cos = (a) => {
    return Math.cos(i * a);
  };
  return cos(0.2) * cos(0.5) * cos(0.1) * cos(0.05);
}

/**
 * Returns the path to a rock texture
 *
 * @return {String}
 */
function rockTexturePath() {
  return path.join(__dirname, '../../../..', 'assets/textures', 'rock.jpg');
}

/**
 * Creates the Plane
 *
 * @return {Array<Number>}
 */
function createPlane() {

  return new p2.Plane({
  });
}

/**
 * FlatParcour
 *
 * @extends {P2Pixi.GameObject}
 */
export default class FlatParcour extends P2Pixi.GameObject {

  /**
   * @param {P2Pixi.GameObject} game
   */
  constructor(game) {
    super(game);

    const bodyOptions = {
      collisionGroup: 1,
      collisionMask: 2 // 1 | 2
    };

    const texture = PIXI.Texture.fromImage(rockTexturePath(), false);

    const body = new p2.Body({
      position: [-75, -10],
      mass: 0
    });

    this.addBody(body);
    this.addShape(body, createPlane(), [0, 0], 0, bodyOptions, null, texture);
  }

}
