'use strict';

import { PartialGenotype } from 'genotype';

/**
 * Enumeration of different joint orientations.
 * A joint can bend itself either back or forth.
 *
 * @enum {Number}
 */
const ORIENTATION = {
  BACK: 1,
  FORTH: 2
};

/**
 * Default minimal angle in rad.
 * Equals to 270 degree.
 *
 * @type {Number}
 */
const DEFAULT_ANGLE_MIN = 3 / 2 * Math.PI;

/**
 * Default maximal angle in rad.
 * Equals to 150 degree.
 *
 * @type {Number}
 */
const DEFAULT_ANGLE_MAX = 5 / 6 * Math.PI;

/**
 * Represents a joint of a leg of an indiviual.
 * A joint connects two parts of a body of an individual.
 */
export default class Joint extends PartialGenotype {

  /**
   * Default constructor of a joint of an individual.
   *
   * @param {Number} [angleMin=] Minimal angle in rad
   * @param {Number} [angleMax=] Maximal angle in rad
   * @param {ORIENTATION} [orientation=ORIENTATION.BACK] The joint's orientation.
   */
  constructor(angleMin = DEFAULT_ANGLE_MIN,
              angleMax = DEFAULT_ANGLE_MAX,
              orientation = ORIENTATION.BACK) {
    this.angleMin = angleMin;
    this.angleMax = angleMax;
    this.orientation = orientation;
  }

}
