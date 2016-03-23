/**
 * Partial genotype joint module.
 *
 * @module algorithm/genotype/individual/joint
 * @see module:algorithm/genotype/genotype
 */

import L  from 'partial.lenses';
import { set, view } from 'ramda';
import { PartialGenotype } from '../genotype/genotype';

/**
 * Enumeration of different joint orientations.
 * A joint can bend itself either back or forth.
 *
 * @enum {Number}
 */
export const ORIENTATION = {
  BACK: 1,
  FORTH: 2
};

/**
 * Minimal angle in rad.
 *
 * @type {Number}
 */
export const ANGLE_MIN = -Math.PI / 3;

/**
 * Maximal angle in rad.
 *
 * @type {Number}
 */
export const ANGLE_MAX = Math.PI / 2;

const lensOrientation = L.prop('orientation');
const lensPosition = L.prop('position');

/**
 * Represents a joint of a leg of an indiviual.
 * A joint connects two parts of a body of an individual.
 *
 * @extends {PartialGenotype}
 */
export default class Joint extends PartialGenotype {

  /**
   * Default constructor of a joint of an individual.
   *
   * @param {Object} options
   * @param {ORIENTATION} options.orientation
   */
  constructor(options) {

    super(options);

    this.angleMin = ANGLE_MIN;
    this.angleMax = ANGLE_MAX;
    this.orientation = view(lensOrientation, options);
  }

  /**
   * Returns the identifier for a joint.
   *
   * @return {String}
   */
  static get identifier() {
    return 'joint';
  }

  /**
   * Returns a randomly seeded joint.
   *
   * @param {Object} options
   * @param {ORIENTATION} options.orientation
   * @return {Object}
   */
  static seed(options) {
    const orientation = view(lensOrientation, options) || ORIENTATION.BACK;
    return super.seed(set(lensOrientation, orientation, options));
  }

}

/**
 * Represents a hip joint of an individual.
 * A hip joint connects the body to a leg.
 *
 * @extends {Joint}
 */
export class HipJoint extends Joint {

  /**
   * Default constructor for a hip joint.
   *
   * @param {Object} options
   * @param {ORIENTATION} options.orientation
   * @param {Point} options.position
   */
  constructor(options) {

    super(options);

    this.position = view(lensPosition, options);
  }

  /**
   * Returns a randomly seeded joint.
   *
   * @param {Object} options
   * @param {ORIENTATION} options.orientation
   * @param {Point} options.position
   * @return {Object}
   */
  static seed(options) {
    const position = view(lensPosition, options) || [1, 2];
    return super.seed(set(lensPosition, position, options));
  }

}

/**
 * Represents a knee joint of an individual.
 * A knee joint connects the thigh and the shank of a leg.
 *
 * @extends {Joint}
 */
export class KneeJoint extends Joint {}
