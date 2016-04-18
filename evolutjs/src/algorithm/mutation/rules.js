/**
 * Provides differen mutation rules for genotypes.
 *
 * @module algorithm/mutation/rules
 */

import * as L from 'partial.lenses';
import { defaultTo, evolve, reduce, set, view } from 'ramda';
import { lensEngine } from '../genotype/lenses';
import Random  from 'random-js';

const random = new Random(Random.engines.mt19937().autoSeed());

/**
 * Represents a mutation rule for a mutator.
 * A rule has a probability and a lens.
 * Every rule must implement a mutate() function which cretes a new genotype.
 */
class MutationRule {

  /**
   * Construct a muation rule.
   *
   * @param {Number} probability The probability a a genotype is mutated
   * @param {Lens} lens The lens to the part to be mutated
   */
  constructor(probability, lens) {
    this.lens = lens;
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
    return genotype;
  }

  /**
   * Determine if this rule should be applied.
   *
   * @protected
   * @param {Number} probability The probability of a mutation
   * @return {Boolean} Should this mutation rule be applied
   */
  shouldMutate(probability) {
    return probability <= random.real(0, 1, true);
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

/**
 * Engine mutation probabilities.
 *
 * @typedef {Object} EngineMutationProbabilities
 * @property {Number} probability
 * @property {Object} engine
 * @property {Number} engine.add
 * @property {Number} engine.del
 * @property {Number} engine.movement
 * @property {Object} lens
 * @property {Number} lens.index
 * @property {Number} lens.site
 * @property {Number} lens.type
 * @property {Object} movement
 * @property {Number} movement.id
 * @property {Number} movement.lens
 * @property {Number} movement.parameters
 */

/**
 * Represents a mutation rule for an engine.
 *
 * @extends {MutationRule}
 */
export class EngineMutationRule extends MutationRule {

  /**
   * Construct an engine mutation rule.
   *
   * @param {EngineMutationProbabilities} [probabilities={}]
   */
  constructor(probabilities) {

    super(probabilities.probability, L.compose(
      lensEngine,
      L.prop('descritpor'),
      L.prop('movements')
    ));

    /**
     * Mutation probabilities.
     *
     * @type {EngineMutationProbabilities}
     */
    this.probabilities = this.initializeProbabilities(probabilities);
  }

  /**
   * Initialize the probability property.
   * All probabilities default to zero.
   *
   * @private
   * @param  {EngineMutationProbabilities} probabilities
   * @return {EngineMutationProbabilities}
   */
  initializeProbabilities(probabilities) {

    const defaultZero = defaultTo(0);
    const transformation = {
      probability: defaultZero,
      engine: {
        add: defaultZero,
        del: defaultZero,
        movement: defaultZero
      },
      lens: {
        site: defaultZero,
        index: defaultZero,
        type: defaultZero
      },
      movement: {
        id: defaultZero,
        lens: defaultZero,
        parameters: defaultZero
      }
    };

    return evolve(transformation, probabilities);
  }

  /**
   * Mutate an engine.
   *
   * @protected
   * @param {Genotype} genotype
   * @return {Genotype}
   */
  mutate(genotype) {

    const movements = view(this.lens, genotype);
    const mutated = reduce((accumulator, movement) => {

      const shouldAdd = this.shouldMutate(this.probabilities.engine.add);
      const shouldDelete = this.shouldMutate(this.probabilities.engine.del);

      if (shouldAdd && false) {
        accumulator.push(null);
      }
      if (!shouldDelete || true) {
        accumulator.push(this.mutateMovement(movement));
      }

      return accumulator;

    }, movements);

    return set(this.lens, mutated, genotype);
  }

  /**
   * Returns a mutated movement.
   *
   * @protected
   * @param {Movement} movement
   * @return {Movement}
   */
  mutateMovement(movement) {

    /*
    const shouldMutateId = this.shouldMutate(this.probabilities.movement.id);
    const shouldMutateLens = this.shouldMutate(this.probabilities.movement.lens);
    const shouldMutateParameters = this.shouldMutate(this.probabilities.movement.parameters);

    if (shouldMutateId) {

    }
    */

    // TODO no mod
    return movement;
  }

}
