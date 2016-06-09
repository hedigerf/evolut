/**
 * Provides mutation rules for an engine.
 *
 * @module algorithm/mutation/rules/engine
 * @see algorithm/mutation/rule
 */

import { defaultTo, range, values } from 'ramda';
import { getMovement, isCompoundMovement, makeRandomMovementDescriptor } from '../../../engine/movement';
import { Sides, Types } from '../../../engine/lenses';
import MutationRule from '../rule';
import random from '../../../util/random';

/**
 * Engine mutation probabilities.
 *
 * @typedef {Object} EngineMutationOption
 * @property {Number} add
 * @property {Number} remove
 * @property {Object} lens
 * @property {Number} lens.index
 * @property {Number} lens.site
 * @property {Number} lens.type
 * @property {Object} movement
 * @property {Number} movement.id
 * @property {Number} movement.parameters
 */

/**
 * Represents a mutation rule for an engine.
 *
 * @extends {MutationRule}
 */
export default class EngineMutationRule extends MutationRule {

  /**
   * Return the option transformation.
   *
   * @return {EngineMutationOption} The transformation
   */
  static get transformation() {
    const defaultProbability = defaultTo(0.001);
    return {
      add: defaultProbability,
      remove: defaultProbability,
      lens: {
        index: defaultProbability,
        side: defaultProbability,
        type: defaultProbability
      },
      movement: {
        id: defaultProbability,
        parameters: defaultProbability
      }
    };
  }

  /**
   * Mutate an engine's movements.
   *
   * @protected
   * @param {Genotype} genotype
   * @return {Genotype}
   */
  mutate(genotype) {

    const descriptor = genotype.engine.descriptor;

    descriptor.initial = this.mutateMovements(genotype, descriptor.initial);
    descriptor.movements = this.mutateMovements(genotype, descriptor.movements);

    return genotype;
  }

  /**
   * Mutates a list of movements.
   *
   * @protected
   * @param {Genotype} genotype
   * @param {Array<MovementDescriptor>} movements The movements
   * @return {Array<MovementDescriptor>} The mutated movements
   */
  mutateMovements(genotype, movements) {

    const length = movements.length;
    const mutated = [];

    for (let i = 0; i < length; i++) {

      if (this.shouldMutate(this.options.add)) {
        mutated.push(makeRandomMovementDescriptor());
      }

      if (!this.shouldMutate(this.options.remove)) {

        const movement = movements[i];
        let mutatedMovement;

        if (isCompoundMovement(movement)) {
          mutatedMovement = this.mutateCompoundMovement(genotype, movement);
        } else {
          mutatedMovement = this.mutateSingleMovement(genotype, movement);
        }
        mutated.push(mutatedMovement);
      }
    }

    return mutated;
  }

  /**
   * Mutates a compound movement.
   *
   * @param {Genotype} genotype
   * @param {MovementDescriptor} movement
   * @return {MovementDescriptor}
   */
  mutateCompoundMovement(genotype, movement) {

    movement.id = random.pick(['all', 'one']);
    movement.params = this.mutateMovements(genotype, movement.params);

    return movement;
  }

  /**
   * Mutates a single movement.
   *
   * @param {Genotype} genotype
   * @param {MovementDescriptor} movement
   * @return {MovementDescriptor}
   */
  mutateSingleMovement(genotype, movement) {
    movement.lens = this.mutateSingleLens(genotype, movement.lens);
    return this.mutateSingleParams(genotype, movement);
  }

  /**
   * Mutates a lens of a single movement.
   *
   * @param {Genotype} genotype
   * @param {LensDescriptor} lens
   * @return {LensDescriptor}
   */
  mutateSingleLens(genotype, lens) {

    if (this.shouldMutate(this.options.lens.index)) {
      lens.index = random.pick(range(0, 3));
    }
    if (this.shouldMutate(this.options.lens.side)) {
      lens.side = random.pick(values(Sides));
    }
    if (this.shouldMutate(this.options.lens.type)) {
      lens.type = random.pick(values(Types));
    }

    return lens;
  }

  /**
   * Mutates the parameters of a single movement.
   *
   * @param {Genotype} genotype
   * @param {MovementDescriptor} movement
   * @return {MovementDescriptor}
   */
  mutateSingleParams(genotype, movement) {

    if (!movement.params || !movement.params.length) {
      return movement;
    }

    const bounds = getMovement(movement.id).bounds;

    switch (movement.id) {

      case 'sta':
      case 'sts':
        const step = this.options.movement[movement.id].step;
        movement.params = movement.params.map((p, i) => this.mutateNumeric(p, step, bounds[i]));
        break;

      case 'stm':
      case 'utl':
        movement.params = [random.pick(bounds)];
        break;

    }

    return movement;
  }

}
