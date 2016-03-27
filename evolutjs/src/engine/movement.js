/**
 * Provides movement functionality for engines.
 *
 * @module engine/movement
 */

import { curry, view } from 'ramda';

import { Movement } from './engine';

/**
 * Default angle.
 *
 * @type {Number}
 */
export const ANGLE_ZERO = 0;

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
 * Chains movements to gether
 *
 * @param  {...function(Phenotype, Number)} movements A list of movements
 * @return {function(Phenotype, Number): Boolean}
 */
export function chain(...movements) {
  return (phenotype, time) => movements.reduce((st, m) => m(phenotype, time) && st, true);
}

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
 * Waits for a certain amount of time.
 *
 * @extends {Movement}
 */
class Delay extends Movement {

  /**
   * Apply the movemement to a phenotype.
   *
   * @param {Number} start The start time
   * @param {Number} timeout The timeout in miliseconds
   * @param {Phenotype} phenotype The target phenotype
   * @param {Number} time The world time
   * @return {Boolean}
   */
  static move(start, timeout, phenotype, time) {
    return start + timeout <= time;
  }

}

/**
 * Locks a revolute constraint to certain angles.
 *
 * @extends {Movement}
 */
class SetAnglesTo extends Movement {

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
 * Locks an angle to 0 of a constraint.
 *
 * @function
 * @param {Lens} lens The lens to a contraint
 * @param {Boolean} phenotype The target phenotype
 * @return {Boolean}
 */
export const lockAngleToZero = curry(
  (lens, phenotype) => SetAnglesTo.move(ANGLE_ZERO, ANGLE_ZERO, lens, phenotype)
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

export const delay = curry(
  (start, timeout, phenotype, time) => Delay.move(start, timeout, phenotype, time)
);
