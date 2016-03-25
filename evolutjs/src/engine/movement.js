/**
 * Provides movement functionality for engines.
 *
 * @module engine/movement
 */

import { curry, view } from 'ramda';

import { Movement } from './engine';
import { ANGLE_MAX, ANGLE_MIN } from '../algorithm/individual/joint';

/**
 * Default angle.
 *
 * @type {Number}
 */
const ANGLE_ZERO = 0;

const BLUR_FACTOR_DIVIDEND = 10;

/**
 * Tolerated margin of an angle.
 *
 * @type {Number}
 */
const BLUR_FACTOR = Math.PI / BLUR_FACTOR_DIVIDEND;

/**
 * Tests a revolute constraint if it's angle is at it's maximum angle.
 *
 * @param {RevoluteConstraint} constraint The constraint.
 * @param {Number} angle An angle.
 * @return {Boolean}
 */
export function isMaxAngle(constraint, angle) {
  return constraint.lowerLimit + BLUR_FACTOR >= angle;
}

/**
 * Tests a revolute constraint if it's angle is at it's minimum angle.
 *
 * @param {RevoluteConstraint} constraint The constraint.
 * @param {Number} angle An angle.
 * @return {Boolean}
 */
export function isMinAngle(constraint, angle) {
  return constraint.upperLimit - BLUR_FACTOR <= angle;
}

/**
 * Set the angles of a revolute constraint.
 *
 * @param {RevoluteConstraint} constraint
 * @param {Number} [min=ANGLE_MIN]
 * @param {Number} [max=ANGLE_MAX]
 */
export function setAngle(constraint, min = ANGLE_MIN, max = ANGLE_MAX) {
  constraint.setLimits(-max, -min);
}

/**
 * Locks a revolute constraint to a certain angle.
 *
 * @extends {Movement}
 */
class LockAngleTo extends Movement {

  /**
   * Apply the movemement to a phenotype.
   *
   * @param {Number} angle The angle a constraint should be locked to.
   * @param {Lens} lens The lens to a contraint.
   * @param {Phenotype} phenotype The target phenotype
   * @return {Phenotype}
   */
  static move(angle, lens, phenotype) {

    const constraint = view(lens, phenotype);
    setAngle(constraint, angle, angle);

    return phenotype;
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
   * @param {Number} angleMin The min angle a constraint should be locked to.
   * @param {Number} angleMax The max angle a constraint should be locked to.
   * @param {Lens} lens The lens to a contraint.
   * @param {Phenotype} phenotype The target phenotype
   * @return {Phenotype}
   */
  static move(angleMin, angleMax, lens, phenotype) {

    const constraint = view(lens, phenotype);
    constraint.setLimits(-angleMax, -angleMin);

    return phenotype;
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
   * @param {Number} speed The speed of a constraint.
   * @param {Lens} lens The lens to a contraint.
   * @param {Phenotype} phenotype The target phenotype
   * @return {Phenotype}
   */
  static move(speed, lens, phenotype) {

    const constraint = view(lens, phenotype);
    constraint.setMotorSpeed(speed);

    return phenotype;
  }

}

/**
 * Locks an angle of a constraint.
 *
 * @param {Number} angle The angle a constraint should be locked to.
 * @param {Lens} lens The lens to a contraint.
 * @param {Phenotype} phenotype The target phenotype.
 */
export const lockAngleTo = curry(
  (angle, lens, phenotype) => LockAngleTo.move(angle, lens, phenotype)
);

/**
 * Locks an angle to 0 of a constraint.
 *
 * @param {Lens} lens The lens to a contraint.
 * @param {Phenotype} phenotype The target phenotype.
 */
export const lockAngleToZero = curry(
  (lens, phenotype) => lockAngleTo.move(ANGLE_ZERO, lens, phenotype)
);

/**
 * Sets the angles of a constraint.
 *
 * @param {Number} angleMin The min angle a constraint should be locked to.
 * @param {Number} angleMax The max angle a constraint should be locked to.
 * @param {Lens} lens The lens to a contraint.
 * @param {Phenotype} phenotype The target phenotype.
 */
export const setAngles = curry(
  (angleMin, angleMax, lens, phenotype) => SetAnglesTo.move(angleMin, angleMax, lens, phenotype)
);

/**
 * Sets the speed of a constraint.
 *
 * @param {Number} speed The speed e a constraint should be set to.
 * @param {Lens} lens The lens to a contraint.
 * @param {Phenotype} phenotype The target phenotype.
 */
export const setSpeed = curry(
  (speed, lens, phenotype) => SetSpeedTo.move(speed, lens, phenotype)
);
