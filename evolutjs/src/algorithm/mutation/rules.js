/**
 *
 * @module algorithm/mutation/rules
 */

import { reduce, set, view } from 'ramda';
import { lensEngine } from '../genotype/lenses';
import { makeLensDescriptor } from '../../engine/constraintLenses';
import Random  from 'random-js';

const random = new Random(Random.engines.mt19937().autoSeed());

/**
 * Represents a mutation rule for a mutator.
 * A rule has a probability and a lens.
 * Every rule must implement a mutate() function which cretes a new genotype.
 */
export class MutationRule {

  /**
   * Construct a muation rule.
   *
   * @param {Number} probability The probability a a genotype is mutated
   * @param {Lens} lens The lens to the part to be mutated
   */
  construct(probability, lens) {
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
    return probability * 100 <= random.integer(0, 100);
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
 * Represents a mutation rule for an engine.
 *
 * @extends {MutationRule}
 */
export class EngineMuationRule extends MutationRule {

  construct(probability) {
    super(probability, lensEngine);
  }

  mutate(genotype) {

    const engine = view(this.lens, genotype);
    const movements = engine.descriptor.movements;

    // change
    // add / delete

    return genotype;
  }

  mutateDescriptor(descriptor) {

    // select id
    // select params
    // select lens

    const id = selectDescriptorId(descriptor);
    const lens = makeRandomLensDescriptor();
    const params = [];

    const m = compose(
      set(lensId, makeRandomMovementId),
      set(lensLens, makeRandomLensDescriptor),
      set(lensParams, makeRandomMovementParams)
    );

    return m(descriptor);
  }

}
