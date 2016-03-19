'use strict';

import L from 'partial.lenses';
import { compose, view } from 'ramda';

import { lensPartialGenotypeOption } from '../../util/lens';

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
   * @param {Array} options
   * @return {Object}
   */
  static seed(options) {

    const lensJoint = lensPartialGenotypeOption(this.identifier);
    const lensOrientation = compose(lensJoint, L.prop('orientation'));

    const orientation = view(lensOrientation, options) || ORIENTATION.BACK;

    return super.seed([{
      [this.identifier]: {
        orientation
      }
    }]);
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
   * @param {Array} options
   * @return {Array}
   */
  static seed(options) {

    const lensJoint = lensPartialGenotypeOption(this.identifier);
    const lensPosition = compose(lensJoint, L.prop('position'));

    const position = view(lensPosition, options) || [1, 2];

    return super.seed([{
      [this.identifier]: {
        position
      }
    }]);
  }

}

/**
 * Represents a knee joint of an individual.
 * A knee joint connects the thigh and the shank of a leg.
 */
export class KneeJoint extends Joint {}
