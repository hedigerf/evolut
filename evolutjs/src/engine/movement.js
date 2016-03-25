/**
 * Provides movement functionality for engines.
 *
 * @module engine/movement
 */

import { curry, view } from 'ramda';

import { Movement } from './engine';
import { ANGLE_MAX, ANGLE_MIN } from '../algorithm/individual/joint';

/**
 * Locks a revolute constraint to a certain angle.
 *
 * @extends {Movement}
 */
export class LockAngleTo extends Movement {

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
 * Set the angles of a revolute constraint.
 *
 * @param {RevoluteConstraint} constraint
 * @param {Number} [min=ANGLE_MIN]
 * @param {Number} [max=ANGLE_MAX]
 */
function setAngle(constraint, min = ANGLE_MIN, max = ANGLE_MAX) {
  constraint.setLimits(-max, -min);
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
