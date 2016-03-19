'use strict';

import p2 from 'p2';
import Random from 'random-js';
import {List, Map} from 'immutable';
import log4js from 'log4js';


import Phenotype from './phenotype';
import HipConstraint from './constraints/hipConstraint';
import {debug, info} from '../../../util/logUtil';

const random = new Random(Random.engines.mt19937().autoSeed());

/**
 * Returns a random color
 *
 * @return {Number}
 */
function randomColor() {
  return parseInt((random.hex(6)), 16);
}
const logger = log4js.getLogger('Individual');


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
      collisionGroup: Math.pow(2, 1),
      collisionMask: Math.pow(2, 0)
    };

    const body = new p2.Body({
      position: [-30, 1],
      mass: 1
    });

    const style = {
      lineWidth: 1,
      lineColor: randomColor(),
      fillColor: randomColor()
    };

    this.addBody(body);
    this.addShape(body, this.makeShape(genotype.instanceParts.body.bodyPoints), [0, 0], 0, bodyOptions, style);

    const createLeg = ({ hipPivotA, hipPivotB, speed }) => {
      const jointBody = new p2.Body({
        mass: 1,
        position: [body.position[0] - 0.5, 0.7]
      });

      this.addBody(jointBody);
      this.addShape(jointBody, new p2.Circle({ radius: 0.1 }), [0, 0] , 0, bodyOptions, style);

      const revoluteHip = new p2.RevoluteConstraint(body, jointBody, {
        localPivotA: hipPivotA,
        localPivotB: hipPivotB,
        collideConnected: false
      });

      revoluteHip.enableMotor();
      revoluteHip.setMotorSpeed(speed); // Rotational speed in radians per second
      // revoluteHip.disableMotor();
      const maxAngle = 0;
      const minAngle = -1 * maxAngle;
      revoluteHip.setLimits(minAngle, maxAngle);
      this.addConstraint(revoluteHip);

      const styleLeg = {
        lineWidth: 1,
        lineColor: randomColor(),
        fillColor: randomColor()
      };
      const legBody = new p2.Body({
        mass: 1,
        position: [jointBody.position[0], jointBody.position[1] - 0.3]
      });
      this.addBody(legBody);
      const legShape = new p2.Box({ width: 0.1, height: 0.4 });
      this.addShape(legBody, legShape, [0, 0] , 0, bodyOptions, styleLeg);
      const lockConstraint = new p2.LockConstraint(jointBody, legBody, {
        collideConnected: false
      });
      this.addConstraint(lockConstraint);

      return revoluteHip;
    };
    // Const speed = 5;
    const speed = 0;
    const toLeg = ({ id, aXval, speed }) => {
      return (
        [
          id,
          createLeg(
          {
            hipPivotA: [aXval, -0.1],
            hipPivotB: [0, 0],
            speed: speed
          })
        ]);
    };
    let hipMap = new Map();
    const bluePrints = List.of(
      { id: 'back', aXval: 0.05, speed: speed },
      { id: 'middle', aXval: 0.5, speed: speed },
      { id: 'front' , aXval: 0.95, speed: speed }
    );
    const leftSide = bluePrints.map(toLeg);
    const rightSide = bluePrints.map(toLeg);
    hipMap = hipMap.set('left', new Map(leftSide));
    hipMap = hipMap.set('right', new Map(rightSide));
    this.hipMap = hipMap;

    /*Const hipPivotAxValues = List.of (
        { id: 'backLeftLeg', aXval: 0.05, speed: speed }, { id: 'backRightLeg', aXval: 0.05, speed: -speed },
        { id: 'middleLeftLeg', aXval: 0.5, speed: speed }, { id: 'middleRightLeg', aXval: 0.5, speed: -speed },
        { id: 'frontLeftLeg' , aXval: 0.95, speed: speed }, { id: 'frontRightLeg', aXval: 0.95, speed: -speed });
    const revoluteHips = hipPivotAxValues.map(({ id, aXval, speed }) => {
      return createLeg({
        hipPivotA: [aXval, -0.1],
        hipPivotB: [0, 0],
        speed: speed
      });
    });*/
    //This.revoluteHips = revoluteHips;


    /*
        Const jointBody2 = new p2.Body({
          mass: 1, position: [body.position[0] + 0.5, 0.7]
        });
        this.addBody(jointBody2);
        this.addShape(jointBody2, new p2.Circle({ radius: 0.1 }), [0, 0] , 0, bodyOptions, style);

        const revoluteFront = new p2.RevoluteConstraint(body, jointBody2, {
          localPivotA: [0.95, -0.1], // Where to hinge second wheel on the chassis
          localPivotB: [0, 0],      // Where the hinge is in the wheel (center)
          collideConnected: false
        });
        revoluteFront.enableMotor();
        revoluteFront.setMotorSpeed(30);
        this.addConstraint(revoluteFront);
*/




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
