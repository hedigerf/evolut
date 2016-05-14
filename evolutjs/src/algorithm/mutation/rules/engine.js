/**
 * Provides mutation rules for an engine.
 *
 * @module algorithm/mutation/rules/engine
 * @see algorithm/mutation/rule
 */

import * as L from 'partial.lenses';
import { compose, curry, defaultTo, evolve, ifElse, over, partial, range } from 'ramda';
import { getMovement, isCompoundMovement, makeRandomMovementDescriptor } from '../../../engine/movement';
import MutationRule from '../rule';
import random from '../../../util/random';
import { resolveLensDescriptor } from '../../../engine/lenses';

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
 * Lens to the movement descriptors.
 *
 * @type {Lens}
 */
const lensDescriptor = L.compose(L.prop('engine'), L.prop('descriptor'));

/**
 * Lens to the initial movement descriptor.
 *
 * @type {Lens}
 */
const lensInitial = L.compose(lensDescriptor, L.prop('initial'));

/**
 * Lens to the movements movement descriptor.
 *
 * @type {Lens}
 */
const lensMovements = L.compose(lensDescriptor, L.prop('movements'));

// TODO clean up the mess below

const lensId = L.prop('id');
const lensLens = L.prop('lens');
const lensParams = L.prop('params');

function mutateCompoundId() {
  return random.pick(['all', 'one']);
}

const mutateCompoundMovement = curry(
  (probabilities, genotype, movement) => {

    const mutateCompound = compose(
      over(lensId, mutateCompoundId),
      over(lensParams, partial(mutateMovements, [probabilities, genotype]))
    );

    return mutateCompound(movement);
  }
);

function mutateSingleLens(probabilities, genotype, lens) {

  const t = (p, c) => (v) => {
    if (EngineMutationRule.prototype.shouldMutate(p)) {
      return random.pick(c);
    }
    return v;
  };

  const transformation = {
    index: t(probabilities.lens.index, range(0, 3)),
    side: t(probabilities.lens.side, ['left', 'right']),
    type: t(probabilities.lens.type, ['hip', 'knee'])
  };

  return evolve(transformation, lens);
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

const mutateSingleMovement = curry(
  (probabilities, genotype, movement) => {

    const mutateSingle = compose(
      over(lensLens, partial(mutateSingleLens, [probabilities, genotype])),
      over(L.identity, partial(mutateSingleParams, [probabilities, genotype]))
    );

    return mutateSingle(movement);
  }
);

/**
 * Mutate the initial movements.
 *
 * @param {Object<Number>} probabilities The probabilites
 * @param {Genotype} genotype
 * @param {Array<MovementDescriptor>} movements The movements
 * @return {Array<MovementDescriptor>} The mutated movements
 */
function mutateMovements(probabilities, genotype, movements) {

  const mutateMovement = ifElse(isCompoundMovement,
    mutateCompoundMovement(probabilities, genotype),
    mutateSingleMovement(probabilities, genotype)
  );

  const length = movements.length;
  const mutated = [];

  for (let i = 0; i < length; i++) {

    if (EngineMutationRule.prototype.shouldMutate(probabilities.add)) {
      mutated.push(makeRandomMovementDescriptor());
    }

    if (!EngineMutationRule.prototype.shouldMutate(probabilities.remove)) {
      mutated.push(mutateMovement(movements[i]));
    }

  }

  return mutated;
}

// TODO clean up the mess above

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

    const mutateDescriptor = partial(mutateMovements, [this.options, genotype]);
    const mutateEngine = compose(
      over(lensInitial, mutateDescriptor),
      over(lensMovements, mutateDescriptor)
    );

    return mutateEngine(genotype);
  }

}
