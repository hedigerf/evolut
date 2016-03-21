'use strict';

import log4js from 'log4js';
import {  } from 'ramda';

import { debug } from '../util/logUtil';

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
  static initialStep(phenotype) {  }

  /**
   * Executes a single step of the engine.
   *
   * @static
   * @param {Phenotype} phenotype Applies the movement of this engine to this phenotype.
   */
  static step(phenotype) {

    const jointsMap = phenotype.jointsMap;

    const leftSide = jointsMap.get('left');
    // -const rightSide = jointsMap.get('right');
    const leftBack = leftSide.get('back').hip;
    const leftMiddle = leftSide.get('middle').hip;
    const leftFront = leftSide.get('front').hip;

    const min = -2 * Math.PI;
    const max = 2 * Math.PI;

    leftBack.setLimits(min, max);
    leftFront.setLimits(min, max);
    leftMiddle.setLimits(min, max);

    const speed = -2;

    leftBack.setMotorSpeed(speed);
    leftFront.setMotorSpeed(speed);
    leftMiddle.setMotorSpeed(speed);


    // Find joints
    // check joint position
    // redirect movement

    debug(logger, 'engine step');
  }

}
