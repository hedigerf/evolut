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
    // return [Phase_1, Phase_2];
    return [Phase0, Phase1, Phase2, Phase3];
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
 * First phase of an ants movement engine.
 * Initializes the angles to zero.s
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
 * Represents the second phase.
 * - Unlocks the hip and knee joints
 * - Sets the hip joint motor speed
 * - Waits until the hip joints are fully deflecteds
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
    const speedPhase1 = 1;
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
        M.setSpeed(speedPhase1, lensLBHip),
        M.setSpeed(speedPhase1, lensLFKnee),
        M.setSpeed(speedPhase1, lensLMKnee),
        M.setSpeed(speedPhase1, lensLBKnee)
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
 * Represents the second phase.
 * - Unlocks the hip and knee joints
 * - Sets the hip joint motor speed
 * - Waits until the hip joints are fully deflecteds
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
    const speedPhase1 = -2;
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

// Decorate the static accessors (or the property) 'movements'
// The goal is to memoize this accessor and store it's result.
// Every consecutive call to this accessor will return the stored result.
AntEngine.states.forEach(decorateAccessorStatic(memoize, 'movements'));
