'use strict';

import p2 from 'p2';
import Random from 'random-js';

import P2Pixi from './../../../lib/p2Pixi';

const random = new Random(Random.engines.mt19937().autoSeed());

/**
 * Returns a random position vector
 *
 * @return {Array<Number>}
 */
function randomPosition() {
  return [random.integer(0, 20), random.integer(15, 25)];
}

/**
 * Returns a random color
 *
 * @return {Number}
 */
function randomColor() {
  return parseInt((random.hex(6)), 16);
}

/**
 * Circle object with randomized position, mass and color
 *
 * @extends {P2Pixi.GameObject}
 */
export default class Circle extends P2Pixi.GameObject {

  /**
   * @param {P2Pixi.GameObject} game
   */
  constructor(game) {
    super(game);

    const bodyOptions = {
      collisionGroup: random.integer(4, 20),
      collisionMask: 3
    };

    const body = new p2.Body({
      position: randomPosition(),
      mass: random.integer(2, 200)
    });

    const circle = new p2.Circle({
      radius: 0.25
    });

    const style = {
      lineWidth: 1,
      lineColor: randomColor(),
      fillColor: randomColor()
    };

    this.addBody(body);
    this.addShape(body, circle, [0, 0], 0, bodyOptions, style);
  }

  randomPos() {
    this.bodies[0].position = randomPosition();
  }

  get fitness() {
    return this.bodies[0].position[0];
  }

}
