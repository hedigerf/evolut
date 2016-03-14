'use strict';

import { PartialGenotype } from 'genotype';

/**
 * Represents a foot of a leg of an individual.
 * A foot is a stump, a half circle, attached to the end of a leg, the shank.
 * There ist no joint between a shank and a foot.
 */
export default class Foot extends PartialGenotype {

  /**
   * Default constructor of a foot.
   */
  constructor() {
    super();
  }

  /**
   * Returns a Foot.
   *
   * @override
   * @static
   * @return {Foot}
   */
  static seed() {
    return new Foot();
  }

}
