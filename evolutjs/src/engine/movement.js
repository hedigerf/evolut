/**
 * Provides movement functionality for engines.
 *
 * @module engine/movement
 */

import R, { curry, view } from 'ramda';

import { Movement } from './engine';

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
 * Tests if all movements were completed.
 *
 * @function
 * @param {...function(Phenotype, Number)} movements A list of movements
 * @return {function(Phenotype, Number): Boolean}
 */
export const allPass = (...movements) => R.allPass(movements);

/**
 * Tests if at least one movement was completed.
 *
 * @function
 * @param {...function(Phenotype, Number): Boolean} movements
 * @return {function(Phenotype, Number): Boolean}
 */
export const anyPass = (...movements) => R.anyPass(movements);

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
 * Locks a revolute constraint to certain angles.
 *
 * @extends {Movement}
 */
class SetAnglesTo extends Movement {

  /**
   * Returns the identifier of this movement.
   *
   * @override
   * @return {String}
   */
  static get identifier() {
    return 'setAnglesTo';
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
   * Apply the movemement to a phenotype.
   *
   * @param {function(*, Number): Boolean} pred
   * @param {Lens} lens The lens to a contraint
   * @param {Phenotype} phenotype The target phenotype
   * @param {Number} time The world time
   * @return {Boolean}
   */
  static move(pred, lens, phenotype, time) {
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
export const stop = R.always(false);

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
 * @param {function(*, Number): Boolean} pred
 * @param {function(Lens, *, Number)} onTrue
 * @param {Lens} lens The lens to a contraint
 * @param {Phenotype} phenotype The target phenotype
 * @param {Number} time The world time
 */
export const when = curry(
  (pred, onTrue, lens, phenotype, time) => When.move(pred, onTrue, lens, phenotype, time)
);
