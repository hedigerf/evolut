/**
 * Partial genotype foot module.
 *
 * @module algorithm/genotype/individual/foot
 * @see module:algorithm/genotype/genotype
 */

import { PartialGenotype } from '../genotype/genotype';

/**
 * Represents a foot of a leg of an individual.
 * A foot is a stump, a half circle, attached to the end of a leg, the shank.
 * There ist no joint between a shank and a foot.
 *
 * @extends {PartialGenotype}
 */
export class Foot extends PartialGenotype {

  /**
   * Returns the identifier for a partial genotype.
   *
   * @return {String}
   */
  static get identifier() {
    return 'foot';
  }

}
