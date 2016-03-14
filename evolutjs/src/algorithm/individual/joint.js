'use strict';

import { PartialGenotype } from './genotype';

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
  constructor({ orientation = ORIENTATION.BACK } = {}) {
    super({ orientation });
    this.angleMin = DEFAULT_ANGLE_MIN;
    this.angleMax = DEFAULT_ANGLE_MAX;
    this.orientation = orientation;
  }

  /**
   * Returns the identifier for a joint.
   *
   * @override
   * @static
   * @return {String}
   */
  static get identifier() {
    return 'joint';
  }

  /**
   * Returns a randomly seeded joint.
   *
   * @override
   * @static
   * @param {ORIENTATION} [orientation=ORIENTATION.BACK]
   * @return {Object}
   */
  static seed(orientation = ORIENTATION.BACK) {
    return {
      orientation
    };
  }

}

/**
 * Represents a hip joint of an individual.
 * A hip joint connects the body to a leg.
 */
export class HipJoint extends Joint {

  /**
   * Default constructor for a hip joint.
   *
   * @param {ORIENTATION} { orientation The orientation of a joint.
   * @param {Vector} position } The position of the hip joint.
   */
  constructor({ orientation, position }) {
    super({ orientation });
    this.position = position;
  }

  /**
   * Returns a randomly seeded joint.
   *
   * @override
   * @static
   * @param {ORIENTATION} [orientation=ORIENTATION.BACK] Orientation of the joint.
   * @param {Vector} position The position of a hip joint.
   * @return {Object}
   */
  static seed(orientation = ORIENTATION.BACK, position) {
    return {
      orientation,
      position
    };
  }

}

/**
 * Represents a knee joint of an individual.
 * A knee joint connects the thigh and the shank of a leg.
 */
export class KneeJoint extends Joint { }
