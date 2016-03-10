'use strict';

/**
 * Represents a foot of a leg of an individual.
 * A foot is a stump, a half circle, attached to the end of a leg, the shank.
 * There ist no joint between a shank and a foot.
 */
export default class Foot {

  /**
   * Default constructor of a foot.
   *
   * @param {Number} radius Radius of a foot.
   */
  constructor(radius) {
    this.radius = radius;
  }

}
