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
   * @param {Object}
   */
  constructor({orientation}) {
    this.angleMin = DEFAULT_ANGLE_MIN;
    this.angleMax = DEFAULT_ANGLE_MAX;
    this.orientation = orientation;
  }

}

export class HipJoint extends Joint {

  constructor({orientation, position}) {
    this.angleMin = DEFAULT_ANGLE_MIN;
    this.angleMax = DEFAULT_ANGLE_MAX;
    this.orientation = orientation;
  }

}

export class KneeJoint extends Joint {

  constructor(genotype) {
    super(genotype);
  }

}
