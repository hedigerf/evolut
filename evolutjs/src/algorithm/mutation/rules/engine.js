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

function mutateCompoundMovement(probabilities, genotype, movement) {

  movement.id = random.pick(['all', 'one']);
  movement.params = mutateMovements(probabilities, genotype, movement.params);

  return movement;
}

function mutateSingleLens(probabilities, genotype, lens) {

  if (EngineMutationRule.prototype.shouldMutate(probabilities.lens.index)) {
    lens.index = random.pick(range(0, 3));
  }
  if (EngineMutationRule.prototype.shouldMutate(probabilities.lens.side)) {
    lens.side = random.pick(values(Sides));
  }
  if (EngineMutationRule.prototype.shouldMutate(probabilities.lens.type)) {
    lens.type = random.pick(values(Types));
  }

  return lens;
}

function mutateSingleParams(probabilities, genotype, movement) {

  if (!movement.params || !movement.params.length) {
    return movement;
  }

  const bounds = getMovement(movement.id).bounds;

  switch (movement.id) {

    case 'sta':
    case 'sts':
      const step = probabilities.movement[movement.id].step;
      movement.params = movement.params.map((p, i) => EngineMutationRule.prototype.mutateNumeric(p, step, bounds[i]));
      break;

    case 'stm':
    case 'utl':
      movement.params = [random.pick(bounds)];
      break;

  }

  return movement;
}

function mutateSingleMovement(probabilities, genotype, movement) {
  movement.lens = mutateSingleLens(probabilities, genotype, movement.lens);
  return mutateSingleParams(probabilities, genotype, movement);
}

/**
 * Mutate the initial movements.
 *
 * @param {Object<Number>} probabilities The probabilites
 * @param {Genotype} genotype
 * @param {Array<MovementDescriptor>} movements The movements
 * @return {Array<MovementDescriptor>} The mutated movements
 */
function mutateMovements(probabilities, genotype, movements) {

  const length = movements.length;
  const mutated = [];

  for (let i = 0; i < length; i++) {

    if (EngineMutationRule.prototype.shouldMutate(probabilities.add)) {
      mutated.push(makeRandomMovementDescriptor());
    }

    if (!EngineMutationRule.prototype.shouldMutate(probabilities.remove)) {

      const movement = movements[i];
      let mutatedMovement;

      if (isCompoundMovement(movement)) {
        mutatedMovement = mutateCompoundMovement(probabilities, genotype, movement);
      } else {
        mutatedMovement = mutateSingleMovement(probabilities, genotype, movement);
      }
      mutated.push(mutatedMovement);
    }
  }

  return mutated;
}

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

    descriptor.initial = mutateMovements(this.options, genotype, descriptor.initial);
    descriptor.movements = mutateMovements(this.options, genotype, descriptor.movements);

    return genotype;
  }

}
