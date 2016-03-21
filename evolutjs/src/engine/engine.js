'use strict';

import {} from 'ramda';
import log4js from 'log4js';

import { debug } from '../util/logUtil';

const logger = log4js.getLogger('Engine');

/**
 * Represents an abstract class for an engine.
 * It's responsibility is moving an phenotype's legs.
 */
export default class Engine {

  /**
   * Executes a single step of the engine.
   *
   * @static
   * @param {Phenotype} phenotype Applies the movement of this engine to this phenotype.
   */
  static step(phenotype) {

    // Hips
    const map = phenotype.jointsMap;

    // Find joints
    // check joint position
    // redirect movement

    const leftSide = map.get('left');
    const rightSide = map.get('right');

    const leftBack = leftSide.get('back').hip;
    const leftMiddle = leftSide.get('middle');

    const leftFront = leftSide.get('front');
    const min = -Math.PI;
    const max = Math.PI;
    leftBack.setLimits(min, max);
    leftBack.setMotorSpeed(-2.0);
    leftFront.setLimits(min, max);
    leftFront.setMotorSpeed(-2.0);
    leftMiddle.setLimits(min, max);
    leftMiddle.setMotorSpeed(-2.0);

    debug(logger, JSON.stringify(map));
  }

}
