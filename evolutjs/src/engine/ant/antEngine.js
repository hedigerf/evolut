/**
 * Ant movement engine module.
 *
 * @module engine/ant/antEngine
 * @see module:engine/engine
 */

import L from 'partial.lenses';

import { ANGLE_MAX, ANGLE_MIN } from '../../algorithm/individual/joint';
import Engine, { MovementPhase } from '../engine';
import * as M from '../movement';
import * as CL from '../constraintLenses';
import { decorateAccessorStatic, memoize } from '../../util/decorate';

const lensLFHip = L.compose(CL.lensLeftFrontJoint, CL.lensHip);
const lensLMHip = L.compose(CL.lensLeftMiddleJoint, CL.lensHip);
const lensLBHip = L.compose(CL.lensLeftBackJoint, CL.lensHip);

const lensLFKnee = L.compose(CL.lensLeftFrontJoint, CL.lensKnee);
const lensLMKnee = L.compose(CL.lensLeftMiddleJoint, CL.lensKnee);
const lensLBKnee = L.compose(CL.lensLeftBackJoint, CL.lensKnee);

const lensRFHip = L.compose(CL.lensRightFrontJoint, CL.lensHip);
const lensRMHip = L.compose(CL.lensRightMiddleJoint, CL.lensHip);
const lensRBHip = L.compose(CL.lensRightBackJoint, CL.lensHip);

const lensRFKnee = L.compose(CL.lensRightFrontJoint, CL.lensKnee);
const lensRMKnee = L.compose(CL.lensRightMiddleJoint, CL.lensKnee);
const lensRBKnee = L.compose(CL.lensRightBackJoint, CL.lensKnee);

/**
 * Represents an abstracted version of the movement of an ant.
 *
 * @extends {Engine}
 */
export default class AntEngine extends Engine {

  /**
   * Returns all states of this machine.
   *
   * @protected
   * @return {Array<MovementPhase>}
   */
  static get states() {
    return [Phase0, Phase1, Phase2, Phase3, Phasexx];
  }

  /**
   * Executes a single step of the engine.
   *
   * @param {Phenotype} phenotype Applies the movement of this engine to this phenotype.
   * @param {Number} time The current world time.
   */
  static initialStep(phenotype) {

    const initialSpeed = 0;

    M.chain(
      M.setAngles(ANGLE_MIN, ANGLE_MAX, lensLFHip),
      M.setAngles(ANGLE_MIN, ANGLE_MAX, lensLMHip),
      M.setAngles(ANGLE_MIN, ANGLE_MAX, lensLBHip),
      M.lockAngleToZero(lensRFHip),
      M.lockAngleToZero(lensRMHip),
      M.lockAngleToZero(lensRBHip),
      M.setSpeed(initialSpeed, lensLFHip),
      M.setSpeed(initialSpeed, lensLMHip),
      M.setSpeed(initialSpeed, lensLBHip)
    )(phenotype);
  }

}

/**
 * Represents the first phase of an ant engine's movement.
 *
 * @extends {MovementPhase}
 */
class Phase0 extends MovementPhase {

  /**
   * Returns all movements of this phase.
   *
   * @protected
   * @return {Array<Movement>}
   */
  static get movements() {
    return [
      M.chain(
        M.lockAngleToZero(lensLFHip),
        M.lockAngleToZero(lensLMHip),
        M.lockAngleToZero(lensLBHip),
        M.lockAngleToZero(lensRFHip),
        M.lockAngleToZero(lensRMHip),
        M.lockAngleToZero(lensRBHip)
      )
    ];
  }

}

/**
 * Represents a phase of an ant engine's movement.
 *
 * @extends {MovementPhase}
 */
class Phase1 extends MovementPhase {

  /**
   * Returns all movements of this phase.
   *
   * @protected
   * @return {Array<Movement>}
   */
  static get movements() {
    const speedPhase1 = 2;
    return [
      M.chain(
        M.setAngles(ANGLE_MIN, ANGLE_MAX, lensLFKnee),
        M.setAngles(ANGLE_MIN, ANGLE_MAX, lensLMKnee),
        M.setAngles(ANGLE_MIN, ANGLE_MAX, lensLBKnee),
        M.setAngles(ANGLE_MIN, ANGLE_MAX, lensLFHip),
        M.setAngles(ANGLE_MIN, ANGLE_MAX, lensLMHip),
        M.setAngles(ANGLE_MIN, ANGLE_MAX, lensLBHip)
      ),
      M.chain(
        M.setSpeed(speedPhase1, lensLFHip),
        M.setSpeed(speedPhase1, lensLMHip),
        M.setSpeed(speedPhase1, lensLBHip)
      ),
      M.chain(
        M.until(M.isMaxAngle, lensLFHip),
        M.until(M.isMaxAngle, lensLMHip),
        M.until(M.isMaxAngle, lensLBHip)
      )
    ];
  }

}

/**
 * Represents a phase of an ant engine's movement.
 *
 * @extends {MovementPhase}
 */
class Phase2 extends MovementPhase {

  /**
   * Returns all movements of this phase.
   *
   * @protected
   * @return {Array<Movement>}
   */
  static get movements() {
    const speedPhase1 = 1;
    return [
      M.chain(
        M.setSpeed(speedPhase1, lensRFHip),
        M.setSpeed(speedPhase1, lensRMHip),
        M.setSpeed(speedPhase1, lensRBHip)
      ),
      M.chain(
        M.until(M.isMinAngle, lensRFHip),
        M.until(M.isMinAngle, lensRMHip),
        M.until(M.isMinAngle, lensRBHip)
      )
    ];
  }

}

/**
 * Represents a phase of an ant engine's movement.
 *
 * @extends {MovementPhase}
 */
class Phase3 extends MovementPhase {

  /**
   * Returns all movements of this phase.
   *
   * @protected
   * @return {Array<Movement>}
   */
  static get movements() {
    const speedPhase1 = 1;
    return [
      M.chain(
        M.setSpeed(speedPhase1, lensRFHip),
        M.setSpeed(speedPhase1, lensRMHip),
        M.setSpeed(speedPhase1, lensRBHip)
      ),
      M.chain(
        M.until(M.isMinAngle, lensRFHip),
        M.until(M.isMinAngle, lensRMHip),
        M.until(M.isMinAngle, lensRBHip)
      )
    ];
  }

}

/**
 * Represents the first phase of an ant engine's movement.
 *
 * @extends {MovementPhase}
 */
class Phasexx extends MovementPhase {

  /**
   * Returns all movements of this phase.
   *
   * @protected
   * @return {Array<Movement>}
   */
  static get movements() {
    const speedPhase1 = 1;
    return [
      M.chain(
        M.setSpeed(speedPhase1, lensLFHip),
        M.setSpeed(speedPhase1, lensLMHip),
        M.setSpeed(speedPhase1, lensLBHip)
      ),
      M.chain(
        M.until(M.isMaxAngle, lensLFHip),
        M.until(M.isMaxAngle, lensLMHip),
        M.until(M.isMaxAngle, lensLBHip)
      ),
      M.chain(
        M.setSpeed(-speedPhase1, lensLFHip),
        M.setSpeed(-speedPhase1, lensLMHip),
        M.setSpeed(-speedPhase1, lensLBHip)
      ),
      M.chain(
        M.until(M.isMinAngle, lensLFHip),
        M.until(M.isMinAngle, lensLMHip),
        M.until(M.isMinAngle, lensLBHip)
      ),
      M.chain(
        M.setSpeed(speedPhase1, lensLFHip),
        M.setSpeed(speedPhase1, lensLMHip),
        M.setSpeed(speedPhase1, lensLBHip)
      )
    ];
  }

}

decorateAccessorStatic(memoize, 'movements', Phase0);
decorateAccessorStatic(memoize, 'movements', Phase1);
decorateAccessorStatic(memoize, 'movements', Phase2);
decorateAccessorStatic(memoize, 'movements', Phase3);
