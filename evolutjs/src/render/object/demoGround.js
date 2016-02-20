'use strict';

import p2 from 'p2';
import path from 'path';
import PIXI from 'pixi.js';

import P2Pixi from './../../../lib/p2Pixi';

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
  return path.join(__dirname, '../../..', 'assets/textures', 'rock.jpg');
}

/**
 * Create new height field with 150px width
 *
 * @return {Array<Number>}
 */
function createHeightField() {

  const heights = [];
  let i = 1;
  while (i <= 500) {
    heights.push(toHeight(i++));
  }

  return new p2.Heightfield({
    heights,
    elementWidth: 0.3,
    material: new p2.Material()
  });
}

/**
 * Ground with height field and rocky texture
 *
 * @extends {P2Pixi.GameObject}
 */
export default class CarGround extends P2Pixi.GameObject {

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
    this.addShape(body, createHeightField(), [0, 0], 0, bodyOptions, null, texture);
  }

}
