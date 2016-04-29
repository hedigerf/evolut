/**
 * Provides differen mutation rules for genotypes.
 *
 * @module algorithm/mutation/rule
 */

import { clone } from 'ramda';
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
   * @param {Number} probability The probability a a genotype is mutated
   */
  constructor(probability) {

    /**
     * The probaility that this rule is applied.
     *
     * @protected
     * @type {Number}
     */
    this.probability = probability;
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
   * @return {Number} The mutated value
   */
  mutateNumeric(value, step) {
    return value + random.real(-step, step, true);
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

  /**
   * Try to mutate a genotype with this rule.
   *
   * @param {Genotype} genotype The genotype to be mutated
   * @return {Genotype} The mutated genotype
   */
  tryMutate(genotype) {
    if (this.shouldMutate(this.probability)) {
      return this.mutate(genotype);
    }
    return genotype;
  }

}
