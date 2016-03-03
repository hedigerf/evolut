'use strict';

import log4js from 'log4js';

const logger = log4js.getLogger('Individual');

/**
 * Represents an Individual
 */
export default class Individual{
  /**
   * [fsdfsdfsdfdsfdsf]
   *
   * @param  {Seq<Vector>} bodyPoints   Describes the body of the Individual
   * @param  {Seq<Record<Vector,Leg>>} legsAndPositions   A set with Legs and their Position
   */
  constructor(bodyPoints,legsAndPositions) {
    this.bodyPoints = bodyPoints;
    this.legsAndPositions = legsAndPositions;
    logger.debug('Individual created.');
  }

}
