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

/**
 * Represents the phenotype of an individual.
 * The phenotype is the graphical representation of  it's corresponding genotype.
 */
export default class Individual extends Phenotype {

  /**
   * Creates this phonetype from a genotype.
   *
   * @override
   * @protected
   * @param {Genotype} genotype The genotype
   */
  fromGenotype(genotype) {

    const bodyOptions = {
      collisionGroup: Math.pow(2,1),
      collisionMask: Math.pow(2,0)
    };

    const body = new p2.Body({
      position: [-30, 1],
      mass: random.integer(2, 3)
    });

    const style = {
      lineWidth: 1,
      lineColor: randomColor(),
      fillColor: randomColor()
    };

    this.addBody(body);
    this.addShape(body, this.makeShape(genotype.instanceParts.body.bodyPoints), [0, 0], 0, bodyOptions, style);

    const wheelBody = new p2.Body({
      mass: 1,
      position: [body.position[0] - 0.5,0.7]
    });
    // WheelBody.addShape(new p2.Circle({ radius: 0.1 }));
    this.addBody(wheelBody);
    this.addShape(wheelBody,new p2.Circle({ radius: 0.1 }), [0, 0] , 0, bodyOptions,style);

    var revoluteBack = new p2.RevoluteConstraint(body, wheelBody, {
      localPivotA: [0.05, -0.1],
      localPivotB: [0, 0],
      collideConnected: false
    });
    revoluteBack.enableMotor();
    revoluteBack.setMotorSpeed(30); // Rotational speed in radians per second
    this.addConstraint(revoluteBack);

    const wheelBody2 = new p2.Body({
      mass: 1, position: [body.position[0] + 0.5,0.7]
    });
    this.addBody(wheelBody2);
    this.addShape(wheelBody2,new p2.Circle({ radius: 0.1 }), [0, 0] , 0, bodyOptions,style);

    const revoluteFront = new p2.RevoluteConstraint(body, wheelBody2, {
      localPivotA: [0.95, -0.1], // Where to hinge second wheel on the chassis
      localPivotB: [0, 0],      // Where the hinge is in the wheel (center)
      collideConnected: false
    });
    revoluteFront.enableMotor();
    revoluteFront.setMotorSpeed(30);
    this.addConstraint(revoluteFront);





  }

  /**
   * Returns the shape of the phenotype.
   *
   * @protected
   * @param {Array} bodyPoints
   * @return {p2.Convex}
   */
  makeShape(bodyPoints) {
    return new p2.Convex({ vertices: bodyPoints });
  }

}
