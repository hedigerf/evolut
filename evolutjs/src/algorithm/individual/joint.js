/**
 * Partial genotype joint module.
 *
 * @module algorithm/genotype/individual/joint
 * @see module:algorithm/genotype/genotype
 */

import * as L from 'partial.lenses'
import { set, view } from 'ramda';
import { PartialGenotype } from '../genotype/genotype';

/**
 * Enumeration of different joint orientations.
 * A joint can bend itself either back or forth.
 *
 * @enum {Number}
 */
export const Orientation = {
  BACK: 1,
  FORTH: 2
};

/**
 * Minimal angle in rad.
 *
 * @type {Number}
 */
export const ANGLE_MIN = -Math.PI / 3; // eslint-disable-line no-magic-numbers

/**
 * Maximal angle in rad.
 *
 * @type {Number}
 */
export const ANGLE_MAX = Math.PI / 3; // eslint-disable-line no-magic-numbers

/**
 * Lens for joint orientation information.
 *
 * @return {Lens}
 */
const lensOrientation = L.prop('orientation');

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
   * @param {Orientation} options.orientation
   */
  constructor(options) {

    super(options);

    /**
     * Minimal deflection of this join.
     *
     * @type {Number}
     */
    this.angleMin = ANGLE_MIN;

    /**
     * Maximal deflection of this join.
     *
     * @type {Number}
     */
    this.angleMax = ANGLE_MAX;

    /**
     * Orientation of this joint.
     *
     * @type {Orientation}
     */
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
   * @param {Orientation} options.orientation
   * @return {Object}
   */
  static seed(options) {
    const orientation = view(lensOrientation, options) || Orientation.BACK;
    return super.seed(set(lensOrientation, orientation, options));
  }

}

/**
 * Represents a hip joint of an individual.
 * A hip joint connects the body to a leg.
 *
 * @extends {Joint}
 */
export class HipJoint extends Joint {}

/**
 * Represents a knee joint of an individual.
 * A knee joint connects the thigh and the shank of a leg.
 *
 * @extends {Joint}
 */
export class KneeJoint extends Joint {}
