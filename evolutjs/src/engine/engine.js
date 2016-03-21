'use strict';

import log4js from 'log4js';
import {  } from 'ramda';

import { debug } from '../util/logUtil';
import { ANGLE_MAX, ANGLE_MIN } from '../algorithm/individual/joint';

const logger = log4js.getLogger('Engine');

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

      leftBack.setLimits(ANGLE_MIN, ANGLE_MAX);
      leftFront.setLimits(ANGLE_MIN, ANGLE_MAX);
      leftMiddle.setLimits(ANGLE_MIN, ANGLE_MAX);
    };

    setLimits(leftSide);
    setLimits(rightSide);
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


    const speed = 2;

    const setSpeed = (side) => {

      const leftBack = side.get('back').hip;
      const leftMiddle = side.get('middle').hip;
      const leftFront = side.get('front').hip;

      leftBack.setMotorSpeed(speed);
      leftFront.setMotorSpeed(speed);
      leftMiddle.setMotorSpeed(speed);
    };

    setSpeed(leftSide);

    // Find joints
    // check joint position
    // redirect movement

    debug(logger, 'engine step');
  }


  static stepForward(pheotype, joints) {

    const hipBack = joints.get('back').hip;
    const hipMiddle = joints.get('middle').hip;
    const hipFront = joints.get('front').hip;

    const moveForwardUntilUpperLimit = hip => {

      if (hip.angle < hip.upperLimit) {

      }

    };

  }

  static stepHaul(pheotype, joints) {
    //
  }

}
