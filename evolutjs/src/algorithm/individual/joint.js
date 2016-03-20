'use strict';

import L from 'partial.lenses';
import { set, view } from 'ramda';

import { PartialGenotype } from '../genotype/genotype';

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
    super({});
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
   * @param {Object} options
   * @return {Object}
   */
  static seed(options) {

    const lensOrientation = L.prop('orientation');
    const orientation = view(lensOrientation, options) || ORIENTATION.BACK;

    return super.seed(set(lensOrientation, orientation, options));
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
   * @param {Object}
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
   * @param {Object} options
   * @return {Object}
   */
  static seed(options) {

    const lensPosition = L.prop('position');
    const position = view(lensPosition, options) || [1, 2];

    return super.seed(set(lensPosition, position, options));
  }

}

/**
 * Represents a knee joint of an individual.
 * A knee joint connects the thigh and the shank of a leg.
 */
export class KneeJoint extends Joint {}
