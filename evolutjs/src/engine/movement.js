/**
 * Provides movement functionality for engines.
 * Joint-driven.
 *
 * @module engine/movement
 */

import {
  __, allPass, always, anyPass, append, compose, curry, keys, length, map, partial, tryCatch, view
} from 'ramda';
import { makeRandomLensDescriptor, resolveLensDecriptor } from './constraintLenses';
import { IdentifiableStatic } from '../types/identifiable';
import Random  from 'random-js';

/**
 * Describes a movement.
 *
 * @typedef {Object} MovementDescriptor
 * @property {String} id
 * @property {LensDescriptor} lens
 * @property {Array<*>} params
 */

const random = new Random(Random.engines.mt19937().autoSeed());

/**
 * Divisor for tolerated margin of an angle.
 *
 * @type {Number}
 */
const BLUR_FACTOR_DIVISOR = 10;

/**
 * Tolerated margin of an angle.
 *
 * @type {Number}
 */
const BLUR_FACTOR = Math.PI / BLUR_FACTOR_DIVISOR;

/**
 * @function
 * @param {Number} angle
 * @param {RevoluteConstraint} constraint
 * @return {Boolean}
 */
export const isAngle = curry(
  (angle, constraint) => {
    const currentAngle = constraint.angle;
    return currentAngle - BLUR_FACTOR >= angle || angle <= currentAngle + BLUR_FACTOR;
  }
);

/**
 * Tests a revolute constraint if it's angle is at it's maximum angle.
 *
 * @param {RevoluteConstraint} constraint The constraint.
 * @return {Boolean}
 */
export function isMaxAngle(constraint) {
  return constraint.lowerLimit + BLUR_FACTOR >= constraint.angle;
}

/**
 * Tests a revolute constraint if it's angle is at it's minimum angle.
 *
 * @param {RevoluteConstraint} constraint The constraint.
 * @return {Boolean}
 */
export function isMinAngle(constraint) {
  return constraint.upperLimit - BLUR_FACTOR <= constraint.angle;
}

/**
 * Represents a single movement of a phonotype.
 * A movement could be locking the angle of a joint.
 * Or setting the speed of joint's motor.
 *
 * @abstract
 * @extends {IdentifiableStatic}
 */
export class Movement extends IdentifiableStatic() {

  /**
   * Returns a random parameter list.
   *
   * @return {Array<*>} A parameter list
   */
  static get randomParams() {
    return [];
  }

  /**
   * Returns a the bounds of the parameters.
   *
   * @return {Array<*>} A bounds list
   */
  static get bounds() {
    return [];
  }

  /**
   * Apply the movemement to a phenotype.
   *
   * @param {Phenotype} phenotype The target phenotype
   * @param {Number} time The world time
   * @return {Boolean}
   */
  static move(phenotype, time) { // eslint-disable-line no-unused-vars
    return true;
  }

}

class All extends Movement {

  /**
   * Returns the identifier of this movement.
   *
   * @return {String}
   */
  static get identifier() {
    return 'all';
  }

}

/**
 * Locks a revolute constraint to certain angles.
 *
 * @extends {Movement}
 */
class SetAnglesTo extends Movement {

  /**
   * Returns the identifier of this movement.
   *
   * @return {String}
   */
  static get identifier() {
    return 'sta';
  }

  /**
   * Returns a random parameter list.
   *
   * @return {Array<Number>} A parameter list
   */
  static get randomParams() {

    const fullRadAngle = Math.PI * 2;
    const randomMinAngle = random.real(-fullRadAngle, fullRadAngle);
    const randomMaxAngle = random.real(-fullRadAngle, fullRadAngle);

    return [randomMinAngle, randomMaxAngle];
  }

  /**
   * Returns a the bounds of the parameters.
   *
   * @return {Array<*>} A bounds list
   */
  static get bounds() {
    const fullRadAngle = Math.PI * 2;
    return [-fullRadAngle, fullRadAngle];
  }

  /**
   * Apply the movemement to a phenotype.
   *
   * 0 is always seed as the default angle.
   * Relative to this angle are the angles applied.
   * Max is applied in counter clock wise direction.
   * Min in clock wise direction.
   *
   * p2 receives the angles in a different way.
   * setLimits(min, max)
   *
   * @param {Number} angleMin The min angle a constraint should be locked to
   * @param {Number} angleMax The max angle a constraint should be locked to
   * @param {Lens} lens The lens to a contraint
   * @param {Phenotype} phenotype The target phenotype
   * @return {Boolean}
   */
  static move(angleMin, angleMax, lens, phenotype) {
    view(lens, phenotype).setLimits(-angleMax, -angleMin);
    return true;
  }

}

/**
 * Locks an angle of a revolute constraint to it's initial position (zero).
 *
 * @extends {Movement}
 */
class LockAnglesToZero extends Movement {

  /**
   * Returns the identifier of this movement.
   *
   * @return {String}
   */
  static get identifier() {
    return 'la0';
  }

  /**
   * Apply the movemement to a phenotype.
   *
   * @param {Lens} lens The lens to a contraint
   * @param {Phenotype} phenotype The target phenotype
   * @return {Boolean}
   */
  static move(lens, phenotype) {
    view(lens, phenotype).setLimits(0, 0);
    return true;
  }

}

/**
 * Sets the motor of a revolute constraint.
 *
 * @extends {Movement}
 */
class SetMotor extends Movement {

  /**
   * Returns a random parameter list.
   *
   * @return {Array<Number>} A parameter list
   */
  static get randomParams() {
    return [random.integer(0, 1)];
  }

  /**
   * Returns the identifier of this movement.
   *
   * @return {String}
   */
  static get identifier() {
    return 'stm';
  }

  /**
   * Returns a the bounds of the parameters.
   *
   * @return {Array<*>} A bounds list
   */
  static get bounds() {
    return [0, 1];
  }

  /**
   * Apply the movemement to a phenotype.
   *
   * @param {Boolean} state The state of a motor
   * @param {Lens} lens The lens to a contraint
   * @param {Phenotype} phenotype The target phenotype
   * @return {Boolean}
   */
  static move(state, lens, phenotype) {
    const constraint = view(lens, phenotype);

    if (state) {
      constraint.enableMotor();
    } else {
      constraint.disableMotor();
    }

    return true;
  }

}

/**
 * Sets the speed of a revolute constraint.
 *
 * @extends {Movement}
 */
class SetSpeedTo extends Movement {

  /**
   * Returns a random parameter list.
   *
   * @return {Array<Number>} A parameter list
   */
  static get randomParams() {
    return [random.integer(-1, 1)];
  }

  /**
   * Returns the identifier of this movement.
   *
   * @return {String}
   */
  static get identifier() {
    return 'sts';
  }

  /**
   * Returns a the bounds of the parameters.
   *
   * @return {Array<*>} A bounds list
   */
  static get bounds() {
    return [-1, 1];
  }

  /**
   * Apply the movemement to a phenotype.
   *
   * @param {Number} speed The speed of a constraint
   * @param {Lens} lens The lens to a contraint
   * @param {Phenotype} phenotype The target phenotype
   * @return {Boolean}
   */
  static move(speed, lens, phenotype) {
    view(lens, phenotype).setMotorSpeed(speed);
    return true;
  }

}

/**
 * Test a predicate on a revolute constraint.
 *
 * @extends {Movement}
 */
class Until extends Movement {

  /**
   * Returns a random parameter list.
   *
   * @return {Array<Number>} A parameter list
   */
  static get randomParams() {
    const predicates = ['mxa', 'mia']; // 'isa' left out
    return [random.pick(predicates)];
  }

  /**
   * Returns the identifier of this movement.
   *
   * @return {String}
   */
  static get identifier() {
    return 'utl';
  }

  /**
   * Returns a the bounds of the parameters.
   *
   * @return {Array<*>} A bounds list
   */
  static get bounds() {
    return ['mxa', 'mia'];
  }

  /**
   * Apply the movemement to a phenotype.
   *
   * @param {function(*, Number): Boolean} predId
   * @param {Lens} lens The lens to a contraint
   * @param {Phenotype} phenotype The target phenotype
   * @param {Number} time The world time
   * @return {Boolean}
   */
  static move(predId, lens, phenotype, time) {
    const pred = getMovementPredicate(predId);
    return pred(view(lens, phenotype), time);
  }

}

/**
 * Movement map.
 *
 * @type {Object<Movement>}
 */
const MovementIdMap = {
  [LockAnglesToZero.identifier]: LockAnglesToZero,
  [SetAnglesTo.identifier]: SetAnglesTo,
  [SetMotor.identifier]: SetMotor,
  [SetSpeedTo.identifier]: SetSpeedTo,
  [Until.identifier]: Until
};

function getMovementPredicate(predicateId) {
  switch (predicateId) {
    case 'mxa':
      return isMaxAngle;

    case 'mia':
      return isMinAngle;

    case 'isa':
      return isAngle;
  }
}

/**
 * Makes a movement descriptor object.
 *
 * @param {String} id The movement identifier
 * @param {LensDescriptor} lens The lens descriptor
 * @param {Array<*>} [params=[]] The optional paramerter list
 * @return {MovementDescriptor} The movement descriptor
 */
export function makeMovementDescriptor(id, lens, params = []) {
  return { id, lens, params };
}

/**
 * Returns a random movement descriptor id.
 *
 * @return {String} Moevement descriptor id
 */
export function makeRandomMovementDescriptorId() {
  const ids = keys(MovementIdMap);
  const index = random.integer(0, length(ids) - 1);
  return ids[index];
}

/**
 * Returns a random parameter list for a movement.
 *
 * @param {MovementDescriptor} descriptor A movement descriptor
 * @return {Array} A movement parameter list
 */
export function makeRandomMovementDescriptorParams({ id }) {
  return MovementIdMap[id].randomParams;
}

/**
 * Makes a random movement descriptor.
 *
 * @return {MovementDescriptor} A random movement descriptor
 */
export function makeRandomMovementDescriptor() {

  const id = makeRandomMovementDescriptorId();
  const lens = makeRandomLensDescriptor();
  const params = makeRandomMovementDescriptorParams({ id });

  return makeMovementDescriptor(id, lens, params);
}

/**
 * Returns a 'all' movement descriptor.
 *
 * @param {...MovementDescriptor} params The nested movements
 * @return {MovementDescriptor} The all movement descriptor
 */
export function all(...params) {
  return { id: 'all', params };
}

/**
 * Returns a 'one' movement descriptor.
 *
 * @param {...MovementDescriptor} params The nested movements
 * @return {MovementDescriptor} The one movement descriptor
 */
export function one(...params) {
  return { id: 'one', params };
}

/**
 * Tests a movement id if it is a compound movement.
 * Compound movements group one or more movements togehter.
 *
 *
 * @param {MovementDescriptor} The movement
 * @return {Boolean}
 */
export function isCompoundMovemet({ id }) {
  return id === 'all' || id === 'one';
}

/**
 * Resolves a compound movement descriptor.
 *
 * @param {MovementDescriptor} descriptor The movement descriptor
 * @return {Movement} The movement function
 */
function resolveCompoundMovementDescriptor({ id, params }) {

  let compound;

  if (id === 'all') {
    compound = allPass;
  } else if (id === 'one') {
    compound = anyPass;
  }

  return compound(map(resolveMovementDescriptor, params));
}

/**
 * Resolve a movement descriptor and return the movement function.
 *
 * @param {MovementDescriptor} descriptor The movement descriptor
 * @return {Movement} The movement function
 */
export function resolveMovementDescriptor({ id, lens, params }) {

  if (isCompoundMovemet({ id })) {
    return resolveCompoundMovementDescriptor({ id, params });
  }

  const movement = MovementIdMap[id];
  const lensF = resolveLensDecriptor(lens);

  const tryer = compose(
    append(__, params),
    resolveLensDecriptor
  );
  const catcher = always(params);
  const args = tryCatch(tryer, catcher, lens);

  const args = append(lensF, params);

  return partial(movement.move, args);
}
