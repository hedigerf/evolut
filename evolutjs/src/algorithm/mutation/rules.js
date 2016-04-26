/**
 * Provides differen mutation rules for genotypes.
 *
 * @module algorithm/mutation/rules
 */

import '../../app/log';
import * as L from 'partial.lenses';
import { bind, defaultTo, evolve, has, pipe, reduce, set } from 'ramda';
import {
  isCompoundMovemet,
  makeRandomMovementDescriptor,
  makeRandomMovementDescriptorId,
  makeRandomMovementDescriptorParams
} from '../../engine/movement';
import { makeRandomLensDescriptor } from '../../engine/constraintLenses';
import Random  from 'random-js';

const random = new Random(Random.engines.mt19937().autoSeed());

/**
 * Tests an object if it has the property 'lens'.
 *
 * @function
 * @param {Object}
 * @return {Boolean}
 */
const hasLens = has('lens');

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
   * @param {Number} step The maximum difference to the current value
   */
  constructor(probability, step) {

    /**
     * The probaility that this rule is applied.
     *
     * @protected
     * @type {Number}
     */
    this.probability = probability;

    /**
     * The maximum step for this mutation.
     *
     * @protected
     * @type {Number}
     */
    this.step = step;
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
    return probability >= random.real(0, 1, true);
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

    super(probabilities.probability);

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

    genotype.engine.descriptor.movements = reduce(
      bind(this.reducer, this),
      [],
      genotype.engine.descriptor.movements
    );

    return genotype;
  }

  reducer(accumulator, movement) {

    const shouldAdd = this.shouldMutate(this.probabilities.engine.add);
    const shouldDelete = this.shouldMutate(this.probabilities.engine.del);

    if (shouldAdd) {
      accumulator.push(makeRandomMovementDescriptor());
    }
    if (!shouldDelete) {
      accumulator.push(this.mutateMovement(movement));
    }

    return accumulator;
  }

  /**
   * Returns a mutated movement.
   *
   * @protected
   * @param {Movement} movement
   * @return {Movement}
   */
  mutateMovement(movement) {

    const mutate = pipe(
      bind(this.mutateMovementId, this),
      bind(this.mutateMovementLens, this),
      bind(this.mutateMovementParams, this)
    );

    return mutate(movement);
  }

  /**
   * Returns a movement with a mutated movement identifier.
   *
   * @protected
   * @param {MovementDescriptor} movement A movement descriptor
   * @return {MovementDescriptor} A mutated movement descriptor
   */
  mutateMovementId(movement) {

    const shouldMutate = this.shouldMutate(this.probabilities.movement.id);

    if (shouldMutate) {
      const mutated = set(L.prop('id'), makeRandomMovementDescriptorId(), movement);

      const wasCompound = isCompoundMovemet(movement);
      const isCompound = isCompoundMovemet(mutated);

      if (wasCompound  && !isCompound) {
        mutated.lens = makeRandomLensDescriptor();
        mutated.params = makeRandomMovementDescriptorParams(mutated);
      } else if (!wasCompound && isCompound) {
        delete mutated.lens;
        mutated.params = [makeRandomMovementDescriptor()];
      }

      return mutated;
    }
    return movement;
  }

  /**
   * Returns a movement with a mutated movement lens.
   *
   * @protected
   * @param {MovementDescriptor} movement A movement descriptor
   * @return {MovementDescriptor} A mutated movement descriptor
   */
  mutateMovementLens(movement) {

    const shouldMutate = this.shouldMutate(this.probabilities.movement.lens);

    if (shouldMutate && hasLens(movement)) {
      return set(L.prop('lens'), makeRandomLensDescriptor(), movement);
    }
    return movement;
  }

  /**
   * Returns a movement with mutated movement parameters.
   *
   * @protected
   * @param {MovementDescriptor} movement A movement descriptor
   * @return {MovementDescriptor} A mutated movement descriptor
   */
  mutateMovementParams(movement) {

    const shouldMutate = this.shouldMutate(this.probabilities.movement.parameters);

    if (shouldMutate) {

      // TODO immutability

      if (isCompoundMovemet(movement)) {

        movement.params = reduce(bind(this.reducer, this), [], movement.params);

      } else  {

        movement = set(
          L.prop('params'),
          makeRandomMovementDescriptorParams(movement),
          movement
        );

      }

    }
    return movement;
  }

}
