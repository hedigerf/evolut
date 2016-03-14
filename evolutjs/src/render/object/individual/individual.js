'use strict';

import p2 from 'p2';
import Random from 'random-js';

import Phenotype from './phenotype';

const random = new Random(Random.engines.mt19937().autoSeed());

/**
 * Returns a random color
 *
 * @return {Number}
 */
function randomColor() {
  return parseInt((random.hex(6)), 16);
}

export default class Individual extends Phenotype {

  fromGenotype(genotype) {


    const bodyOptions = {
          collisionGroup: random.integer(4, 20),
          collisionMask: 3
        };

    const body = new p2.Body({
          position: [-50, 0],
          mass: random.integer(2, 200)
        });

    const style = {
          lineWidth: 1,
          lineColor: randomColor(),
          fillColor: randomColor()
        };

    this.addBody(body);
    this.addShape(body, this.makeShape(genotype.bodyPoints), [0, 0], 0, bodyOptions, style);

  }

  makeShape(bodyPoints) {

    // Const circle = new p2.Circle({
    //       radius: 0.25
    //     });
    //

    return new p2.Convex({ vertices: bodyPoints.toArray() });
  }

}
