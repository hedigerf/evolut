/**
 * Provides differen mutation rules for genotypes.
 *
 * @module algorithm/mutation/rule
 */

import { clone, evolve } from 'ramda';
import random from '../../util/random';

/**
 * Determine if this rule should be applied.
 *
 * @protected
 * @param {Number} probability The probability of a mutation
 * @return {Boolean} Should this mutation rule be applied
 */
export function shouldMutate(probability) {
  return probability >= random.real(0, 1, true);
}

/**
 * Represents a mutation rule for a mutator.
 * A rule has a probability and a lens.
 * Every rule must implement a mutate() function which cretes a new genotype.
 */
export default class MutationRule {

  /**
   * Construct a muation rule.
   *
   * @param {Object} [options={}] The mutation options
   */
  constructor(options = {}) {
    this.options = evolve(this.constructor.transformation, options);
  }

  /**
   * Return the option transformation.
   *
   * @return {Object} The transformation
   */
  static get transformation() {
    return {};
  }

  /**
   * Mutate a genotype.
   *
   * @protected
   * @param {Genotype} genotype The genotype to be mutated
   * @return {Genotype} The mutated genotype
   */
  mutate(genotype) {
    return clone(genotype);
  }

  /**
   * Returns a mutated numeric value.
   *
   * @param {Number} value The current value
   * @param {Number} step The maximum difference
   * @param {Number} [limit] The limit to adhere to
   * @return {Number} The mutated value
   */
  mutateNumeric(value, step, limit) {
    const result = value + random.real(-step, step, true);

    if (result <= 0) {
      return value;
    } else if (limit && result > limit) {
      return limit;
    }

    return result;
  }

  /**
   * Determine if this rule should be applied.
   *
   * @protected
   * @param {Number} probability The probability of a mutation
   * @return {Boolean} Should this mutation rule be applied
   */
  shouldMutate(probability) {
    return shouldMutate(probability);
  }

}
