/**
 * Provides mutation rules for an engine.
 *
 * @module algorithm/mutation/rules/engine
 * @see algorithm/mutation/rule
 */

import * as L from 'partial.lenses';
import { compose, curry, defaultTo, evolve, ifElse, over, partial, range } from 'ramda';
import {
  getMovement,
  isCompoundMovement,
  makeRandomMovementDescriptor
} from '../../../engine/movement';
import MutationRule, { shouldMutate } from '../rule';
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

const lensId = L.prop('id');
const lensLens = L.prop('lens');
const lensParams = L.prop('params');

function mutateCompoundId() {
  return random.pick(['all', 'one']);
}

const mutateCompoundMovement = curry(
  (probabilities, movement) => {

    const mutateCompound = compose(
      over(lensId, mutateCompoundId),
      over(lensParams, partial(mutateMovements, [probabilities]))
    );

    return mutateCompound(movement);
  }
);

function mutateSingleLens(probabilities, lens) {

  const t = (p, c) => (v) => {
    if (shouldMutate(p)) {
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

function mutateSingleParams(probabilities, movement) {

  if (!movement.params || !movement.params.length) {
    return movement;
  }

  switch (movement.id) {

    case 'sta':
    case 'sts':
      const step = probabilities.movement[movement.id].step;
      movement.params = movement.params.map((p) => p + random.real(-step, step));
      break;

    case 'stm':
    case 'utl':
      movement.params = [
        random.pick(getMovement(movement.id).bounds)
      ];
      break;

  }

  return movement;
}

const mutateSingleMovement = curry(
  (probabilities, movement) => {

    const mutateSingle = compose(
      over(lensLens, partial(mutateSingleLens, [probabilities])),
      over(L.identity, partial(mutateSingleParams, [probabilities]))
    );

    return mutateSingle(movement);
  }
);

/**
 * Mutate the initial movements.
 *
 * @param {Object<Number>} probabilities The probabilites
 * @param {Array<MovementDescriptor>} movements The movements
 * @return {Array<MovementDescriptor>} The mutated movements
 */
function mutateMovements(probabilities, movements) {

  const mutateMovement = ifElse(isCompoundMovement,
    mutateCompoundMovement(probabilities),
    mutateSingleMovement(probabilities)
  );

  const length = movements.length;
  const mutated = [];

  const probabilityAdd = probabilities.add / length;
  const probabilityRemove = probabilities.del / length;

  for (let i = 0; i < length; i++) {

    if (shouldMutate(probabilityAdd)) {
      mutated.push(makeRandomMovementDescriptor());
    }

    if (!shouldMutate(probabilityRemove)) {
      mutated.push(mutateMovement(movements[i]));
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
    const defaultZero = defaultTo(0);
    return {
      add: defaultZero,
      remove: defaultZero,
      lens: {
        index: defaultZero,
        side: defaultZero,
        type: defaultZero
      },
      movement: {
        id: defaultZero,
        parameters: defaultZero
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

    const mutated = super.mutate(genotype);

    const mutateDescriptor = partial(mutateMovements, [this.options]);
    const mutateEngine = compose(
      over(lensInitial, mutateDescriptor),
      over(lensMovements, mutateDescriptor)
    );

    return mutateEngine(mutated);
  }

}
