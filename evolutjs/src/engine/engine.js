/**
 * Movement engine module.
 *
 * @module engine/engine
 */

import log4js from 'log4js';
import {  } from 'ramda';

import { debug } from '../util/logUtil';
import { ANGLE_MAX, ANGLE_MIN } from '../algorithm/individual/joint';

const logger = log4js.getLogger('Engine');

/**
 * @param {RevoluteConstraint} constraint
 * @param {Number} [min=ANGLE_MIN]
 * @param {Number} [max=ANGLE_MAX]
 */
function setAngle(constraint, min = ANGLE_MIN, max = ANGLE_MAX) {
  constraint.setLimits(-max, -min);
}

const blurFactor = Math.PI / 10;

function isMaxAngle(constraint, angle) {
  return constraint.lowerLimit + blurFactor >= angle;
}

function isMinAngle(constraint, angle) {
  return constraint.upperLimit - blurFactor <= angle;
}

/**
 * Represents an abstract class for an engine.
 * It's responsibility is moving an phenotype's legs.
 */
export default class Engine {

  /**
   * @static
   * @param {Phenotype} phenotype Applies the movement of this engine to this phenotype.
   */
  static initialStep(phenotype) {

    const jointsMap = phenotype.jointsMap;

    const leftSide = jointsMap.get('left');
    const rightSide = jointsMap.get('right');

    const setLimits = (side) => {

      const leftBack = side.get('back').hip;
      const leftMiddle = side.get('middle').hip;
      const leftFront = side.get('front').hip;

      setAngle(leftBack);
      setAngle(leftFront);
      setAngle(leftMiddle);
    };

    const setLimits0 = (side) => {

      const leftBack = side.get('back').hip;
      const leftMiddle = side.get('middle').hip;
      const leftFront = side.get('front').hip;

      setAngle(leftBack, 0, 0);
      setAngle(leftFront, 0, 0);
      setAngle(leftMiddle, 0, 0);
    };

    const setSpeed = (side) => {

      side.get('back').hip.setMotorSpeed(2);
      side.get('middle').hip.setMotorSpeed(2);
      side.get('front').hip.setMotorSpeed(2);

    };

    setLimits0(rightSide);
    setLimits(leftSide);
    setSpeed(leftSide);
  }

  /**
   * Executes a single step of the engine.
   *
   * @static
   * @param {Phenotype} phenotype Applies the movement of this engine to this phenotype.
   */
  static step(phenotype) {

    // Linke Seite bewegt immer nach vorne.
    // Rechte Seite holt immer nach hinten aus.

    const jointsMap = phenotype.jointsMap;

    const leftSide = jointsMap.get('left');
    const rightSide = jointsMap.get('right');

    this.stepForward(phenotype, leftSide);
    this.stepHaul(phenotype, rightSide);

    // Find joints
    // check joint position
    // redirect movement

    debug(logger, 'engine step');
  }


  static stepForward(pheotype, joints) {

    const hipBack = joints.get('back').hip;
    const hipMiddle = joints.get('middle').hip;
    const hipFront = joints.get('front').hip;

    const _speed = 3;

    const moveForwardUntil = hip => {

      const angle = hip.angle;
      const index = hip.equations.indexOf(hip.motorEquation);
      const speed = hip.equations[index].relativeVelocity;

      if (isMaxAngle(hip, angle) && speed > 0) {
        hip.setMotorSpeed(-_speed);
      } else if (isMinAngle(hip, angle) && speed < 0) {
        hip.setMotorSpeed(_speed / 2);
      }

      debug(logger, speed);

    };

    moveForwardUntil(hipBack);
    moveForwardUntil(hipMiddle);
    moveForwardUntil(hipFront);

  }

  static stepHaul(pheotype, joints) {
    //
  }

}
