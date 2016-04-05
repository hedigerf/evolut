/**
 * Provides movement functionality for engines.
 *
 * @module engine/movement
 */

import { allPass, always, anyPass, append, curry, map, partial, view } from 'ramda';
import { getLensById } from './constraintLenses';
import { IdentifiableStatic } from '../types/identifiable';

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
 * @typedef {{
 *   id: String,
 *   lensId: String,
 *   params: Array<*>
 * }} MovementDescriptor
 */

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
 * Locks a revolute constraint to certain angles.
 *
 * @extends {Movement}
 */
class SetAnglesToCurrent extends Movement {

  /**
   * Returns the identifier of this movement.
   *
   * @return {String}
   */
  static get identifier() {
    return 'stc';
  }

  /**
   * @param {Lens} lens The lens to a contraint
   * @param {Phenotype} phenotype The target phenotype
   * @return {Boolean}
   */
  static move(lens, phenotype) {
    const constraint = view(lens, phenotype);
    const angle = constraint.bodyA.angle;
    constraint.setLimits(angle, angle);
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
 * Test a predicate on a revolute constraint and
 * calls a function if fulfilled.
 *
 * @extends {Movement}
 */
class When extends Movement {

  /**
   * Returns the identifier of this movement.
   *
   * @return {String}
   */
  static get identifier() {
    return 'whn';
  }

  /**
   * Apply the movemement to a phenotype.
   *
   * @param {function(*, Number): Boolean} pred
   * @param {function(Lens, *, Number)} onTrue
   * @param {Lens} lens The lens to a contraint
   * @param {Phenotype} phenotype The target phenotype
   * @param {Number} time The world time
   * @return {Boolean}
   */
  static move(pred, onTrue, lens, phenotype, time) {

    const fulfilled = pred(view(lens, phenotype), time);

    if (fulfilled) {
      onTrue(lens, phenotype, time);
    }

    return fulfilled;
  }

}

/**
 * Locks an angle of a constraint.
 *
 * @function
 * @param {Number} angle The angle a constraint should be locked to
 * @param {Lens} lens The lens to a contraint
 * @param {Boolean} phenotype The target phenotype
 * @return {Boolean}
 */
export const lockAngleTo = curry(
  (angle, lens, phenotype) => SetAnglesTo.move(angle, angle, lens, phenotype)
);

/**
 * Locks an angle to the current angle of a constraint.
 *
 * @function
 * @param {Lens} lens The lens to a contraint
 * @param {Boolean} phenotype The target phenotype
 * @return {Boolean}
 */
export const lockAngleToCurrent = curry(
  (lens, phenotype) => SetAnglesToCurrent.move(lens, phenotype)
);

/**
 * Locks an angle to 0 of a constraint.
 *
 * @function
 * @param {Lens} lens The lens to a contraint
 * @param {Boolean} phenotype The target phenotype
 * @return {Boolean}
 */
export const lockAngleToZero = curry(
  (lens, phenotype) => SetAnglesTo.move(0, 0, lens, phenotype)
);

/**
 * Sets the angles of a constraint.
 *
 * @function
 * @param {Number} angleMin The min angle a constraint should be locked to
 * @param {Number} angleMax The max angle a constraint should be locked to
 * @param {Lens} lens The lens to a contraint
 * @param {Boolean} phenotype The target phenotype
 * @return {Boolean}
 */
export const setAngles = curry(
  (angleMin, angleMax, lens, phenotype) => SetAnglesTo.move(angleMin, angleMax, lens, phenotype)
);

/**
 * Sets the speed of a constraint.
 *
 * @function
 * @param {Number} speed The speed e a constraint should be set to
 * @param {Lens} lens The lens to a contraint
 * @param {Boolean} phenotype The target phenotype
 * @return {Boolean}
 */
export const setSpeed = curry(
  (speed, lens, phenotype) => SetSpeedTo.move(speed, lens, phenotype)
);

/**
 * Sets the state of a constraint motor.
 *
 * @function
 * @param {Boolean} state
 * @param {Lens} lens The lens to a contraint
 * @param {Phenotype} phenotype The target phenotype
 * @return {Boolean}
 */
export const setMotor = curry(
  (state, lens, phenotype) => SetMotor.move(state, lens, phenotype)
);

/**
 * Stops the engine.
 *
 * @function
 * @return {Boolean} Always false
 */
export const stop = always(false);

/**
 * Waits until pred is true for a constraint.
 *
 * @function
 * @param {function(*, Number): Boolean} pred
 * @param {Lens} lens The lens to a contraint
 * @param {Phenotype} phenotype The target phenotype
 * @param {Number} time The world time
 * @return {Boolean}
 */
export const until = curry(
  (pred, lens, phenotype, time) => Until.move(pred, lens, phenotype, time)
);

/**
 * Waits until a predicate is true for a constraint
 * and then executes a callback.
 *
 * @function
 * @param {function(*, Number): Boolean} pred
 * @param {function(Lens, *, Number)} onTrue
 * @param {Lens} lens The lens to a contraint
 * @param {Phenotype} phenotype The target phenotype
 * @param {Number} time The world time
 */
export const when = curry(
  (pred, onTrue, lens, phenotype, time) => When.move(pred, onTrue, lens, phenotype, time)
);

/**
 * Lens map.
 *
 * @type {Object<Movement>}
 */
const MovementIdMap = {
  la0: lockAngleToZero,
  [SetAnglesTo.identifier]: setAngles,
  [SetMotor.identifier]: setMotor,
  [SetSpeedTo.identifier]: setSpeed,
  [Until.identifier]: until,
  [When.identifier]: when
};

/**
 * Returns the movement specified by id.
 *
 * @param {String} movementId
 * @return {Lens}
 */
function getMovementById(movementId) {
  return MovementIdMap[movementId];
}

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
 * Make a movement descriptor object.
 *
 * @param {String} id The movement identifier
 * @param {String} lensId The lens identifier
 * @param {Array<*>} [params=[]] The optional paramerter list
 * @return {makeMovementDescriptor} The movement descriptor
 */
export function makeMovementDescriptor(id, lensId, params = []) {
  return { id, lensId, params };
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
 * Resolve a movement descriptor and return the movement function.
 *
 * @param {MovementDescriptor} descriptor The movement descriptor
 * @return {Movement} The movement function
 */
export function resolveMovementDescriptor({ id, lensId, params }) {

  if (id === 'all') {
    return allPass(map(resolveMovementDescriptor, params));
  } else if (id === 'one') {
    return anyPass(map(resolveMovementDescriptor, params));
  }

  const movement = getMovementById(id);
  const lens = getLensById(lensId);
  const args = append(lens, params);

  return partial(movement, args);
}
