/**
 * Provides movement functionality for engines.
 * Joint-driven.
 *
 * @module engine/movement
 */

import { allPass, always, anyPass, append, curry, keys, length, map, view } from 'ramda';
import { makeRandomLensDescriptor, resolveLensDecriptor } from './lenses';
import { IdentifiableStatic } from '../types/identifiable';
import random from '../util/random';

/**
 * Describes a movement.
 *
 * @typedef {Object} MovementDescriptor
 * @property {String} id
 * @property {LensDescriptor} lens
 * @property {Array<*>} params
 */

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
 * @extends {MutatableStatic}
 */
export class Movement extends IdentifiableStatic() {

  /**
   * Returns a the bounds of the parameters.
   *
   * @return {Array<*>} A bounds list
   */
  static get bounds() {
    return [];
  }

  /**
   * Returns a random set of parameters.
   *
   * @return {Array<*>} Randomized parameters
   */
  static get random() {
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

/**
 * Represents a compound movement.
 * A compound movement has a compound function which takes a list of movements
 * and applies all movements in one step and reduces the results to one boolean.
 *
 * @extends {Movement}
 */
class CompoundMovement extends Movement {

  /**
   * Returns a random set of parameters.
   *
   * @return {Array<*>} Randomized parameters
   */
  static get random() {
    return [makeRandomMovementDescriptor()];
  }

  /**
   * Apply the movemement to a phenotype.
   *
   * @protected
   * @param {function(movements: Array<MovementDescriptor>): Boolean} compound
   * @param {Array<MovementDescriptor>} movements
   * @param {Phenotype} phenotype The target phenotype
   * @param {Number} time The world time
   * @return {Boolean}
   */
  static moveCompound(compound, movements, phenotype, time) {

    const resolved = map(resolveMovementDescriptor, movements);
    const move = compound(resolved);

    return move(phenotype, time);
  }

}

/**
 * Represents a compound movement.
 *
 * @extends {CompoundMovement}
 */
class All extends CompoundMovement {

  /**
   * Returns the identifier of this movement.
   *
   * @return {String}
   */
  static get identifier() {
    return 'all';
  }

  /**
   * Apply the movemement to a phenotype.
   *
   * @param {Array<MovementDescriptor>} movements
   * @param {Phenotype} phenotype The target phenotype
   * @param {Number} time The world time
   * @return {Boolean}
   */
  static move(movements, phenotype, time) {
    return super.moveCompound(allPass, movements, phenotype, time);
  }

}

/**
 * Represents a compound movement.
 *
 * @extends {CompoundMovement}
 */
class One extends CompoundMovement {

  /**
   * Returns the identifier of this movement.
   *
   * @return {String}
   */
  static get identifier() {
    return 'one';
  }

  /**
   * Apply the movemement to a phenotype.
   *
   * @param {Array<MovementDescriptor>} movements
   * @param {Phenotype} phenotype The target phenotype
   * @param {Number} time The world time
   * @return {Boolean}
   */
  static move(movements, phenotype, time) {
    return super.moveCompound(anyPass, movements, phenotype, time);
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
   * Returns a the bounds of the parameters.
   *
   * @return {Array<*>} A bounds list
   */
  static get bounds() {
    const fullAngle = Math.PI * 2;
    return [-fullAngle, fullAngle];
  }

  /**
   * Returns a random set of parameters.
   *
   * @return {Array<*>} Randomized parameters
   */
  static get random() {
    const bounds = this.bounds;
    return [random.real(...bounds, true), random.real(...bounds, true)].sort();
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
   * Returns a random set of parameters.
   *
   * @return {Array<*>} Randomized parameters
   */
  static get random() {
    return [random.integer(...this.bounds)];
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
   * Returns a random set of parameters.
   *
   * @return {Array<*>} Randomized parameters
   */
  static get random() {
    return [random.integer(...this.bounds)];
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
   * Returns a random set of parameters.
   *
   * @return {Array<*>} Randomized parameters
   */
  static get random() {
    return [random.pick(this.bounds)];
  }

  /**
   * Apply the movemement to a phenotype.
   *
   * @param {String} predId
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
 * Provieds a mapping between a movement identifier and the implementation.
 *
 * @type {Object<Movement>}
 */
const MovementIdMap = {
  [All.identifier]: All,
  [One.identifier]: One,
  [LockAnglesToZero.identifier]: LockAnglesToZero,
  [SetAnglesTo.identifier]: SetAnglesTo,
  [SetMotor.identifier]: SetMotor,
  [SetSpeedTo.identifier]: SetSpeedTo,
  [Until.identifier]: Until
};

/**
 * Returns the movement class to corresponding to a movement id.
 *
 * @param {String} id A movement id
 * @return {Movement} The movement
 */
export function getMovement(id) {
  return MovementIdMap[id];
}

function getMovementPredicate(predicateId) {
  switch (predicateId) {
    case 'mxa':
      return isMaxAngle;

    case 'mia':
      return isMinAngle;

    case 'isa':
      return isAngle;

    default:
      return always(true);
  }
}

/**
 * Makes a movement descriptor object.
 *
 * @param {String} id The movement identifier
 * @param {LensDescriptor} lens The lens descriptor
 * @param {Array<*>} [params=[]] The optional paramerter list
 * @param {FeedbackDescriptor} [feedback] The optional feedback descriptor
 * @return {MovementDescriptor} The movement descriptor
 */
export function makeMovementDescriptor(id, lens, params = [], feedback) {
  return { id, lens, params, feedback };
}

/**
 * Makes a compound movement descriptor object.
 *
 * @param {String} id The movement identifier
 * @param {Array<*>} [params=[]] The optional paramerter list
 * @return {MovementDescriptor} The movement descriptor
 */
export function makeCompoundMovementDescriptor(id, params) {
  return { id, params };
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
  return getMovement(id).random;
}

/**
 * Makes a random movement descriptor.
 *
 * @return {MovementDescriptor} A random movement descriptor
 */
export function makeRandomMovementDescriptor() {

  const id = makeRandomMovementDescriptorId();
  const params = makeRandomMovementDescriptorParams({ id });

  if (isCompoundMovement({ id })) {
    return makeCompoundMovementDescriptor(id, params);
  }

  const lens = makeRandomLensDescriptor();

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
export function isCompoundMovement({ id }) {
  return id === 'all' || id === 'one';
}

/**
 * Resolve a movement descriptor and return the movement function.
 *
 * @param {MovementDescriptor} descriptor The movement descriptor
 * @return {Movement} The movement function
 */
export function resolveMovementDescriptor({ id, lens, params = [] }) {

  const movement = getMovement(id);
  const args = resolveMovementDescriptorArguments(id, lens, params);

  return movement.move.bind(movement, ...args);
}

/**
 * Resolves the arguments for a movement descriptor.
 *
 * @param  {String} id
 * @param  {LensDescriptor} lens
 * @param  {Array<*>} params
 * @return {Array<*>}
 */
function resolveMovementDescriptorArguments(id, lens, params) {
  if (isCompoundMovement({ id })) {
    return [params];
  }
  return append(resolveLensDecriptor(lens), params);
}
