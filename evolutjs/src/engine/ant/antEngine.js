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
    return [Phase1, Phase2, Phase3];
  }

  /**
   * Executes a single step of the engine.
   *
   * @param {Phenotype} phenotype Applies the movement of this engine to this phenotype.
   * @param {Number} time The current world time.
   */
  static initialStep(phenotype) {
    M.chain(
      M.setAngles(ANGLE_MIN, ANGLE_MAX, lensLFHip),
      M.setAngles(ANGLE_MIN, ANGLE_MAX, lensLMHip),
      M.setAngles(ANGLE_MIN, ANGLE_MAX, lensLBHip),
      M.lockAngleToZero(lensLFHip),
      M.lockAngleToZero(lensLMHip),
      M.lockAngleToZero(lensLBHip),
      M.lockAngleToZero(lensRFHip),
      M.lockAngleToZero(lensRMHip),
      M.lockAngleToZero(lensRBHip),
      M.setSpeed(0, lensLFHip),
      M.setSpeed(0, lensLMHip),
      M.setSpeed(0, lensLBHip)
    )(phenotype);
  }

}

/**
 * Represents the second phase.
 * - Unlocks the hip and knee joints
 * - Sets the hip joint motor speed
 * - Waits until the hip joints are fully deflected
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
      M.chain( // Set angles
        M.setAngles(ANGLE_MIN, ANGLE_MAX, lensLFHip),
        M.setAngles(ANGLE_MIN, ANGLE_MAX, lensLMHip),
        M.setAngles(ANGLE_MIN, ANGLE_MAX, lensLBHip),
        M.setAngles(ANGLE_MIN, ANGLE_MAX, lensLFKnee),
        M.setAngles(ANGLE_MIN, ANGLE_MAX, lensLMKnee),
        M.setAngles(ANGLE_MIN, ANGLE_MAX, lensLBKnee)
      ),
      M.chain( // Move left hips, knees
        M.setSpeed(speedPhase1, lensLFHip),
        M.setSpeed(speedPhase1, lensLMHip),
        M.setSpeed(speedPhase1, lensLBHip),
        M.setSpeed(speedPhase1, lensLFKnee),
        M.setSpeed(speedPhase1, lensLMKnee),
        M.setSpeed(speedPhase1, lensLBKnee)
      ),
      M.chain( // Wait until joints fully deflected
        M.until(M.isMaxAngle, lensLFHip),
        M.until(M.isMaxAngle, lensLMHip),
        M.until(M.isMaxAngle, lensLBHip)
      )
    ];
  }

}

/**
 * Represents the second phase.
 * - Unlocks the hip joints of the other side
 * - Sets the motor speed
 * - Waits until the hip joints are minimally deflected
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
    return [
      M.chain(
        M.setAngles(ANGLE_MIN, ANGLE_MAX, lensRFHip),
        M.setAngles(ANGLE_MIN, ANGLE_MAX, lensRMHip),
        M.setAngles(ANGLE_MIN, ANGLE_MAX, lensRBHip)
      ),
      M.chain( // Halt hip, knee joint motors
        M.setSpeed(0, lensLFHip),
        M.setSpeed(0, lensLMHip),
        M.setSpeed(0, lensLBHip),
        M.setSpeed(0, lensLFKnee),
        M.setSpeed(0, lensLMKnee),
        M.setSpeed(0, lensLBKnee)
      ),
      M.chain(
        M.setSpeed(-1, lensRFHip),
        M.setSpeed(-1, lensRMHip),
        M.setSpeed(-1, lensRBHip)
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
    return [
      M.chain(
        M.setSpeed(0, lensRFHip),
        M.setSpeed(0, lensRMHip),
        M.setSpeed(0, lensRBHip)
      ),
      M.chain(
        M.setAngles(0, ANGLE_MAX, lensLFHip),
        M.setAngles(0, ANGLE_MAX, lensLMHip),
        M.setAngles(0, ANGLE_MAX, lensLBHip),
        M.setAngles(0, ANGLE_MAX, lensLFKnee),
        M.setAngles(0, ANGLE_MAX, lensLMKnee),
        M.setAngles(0, ANGLE_MAX, lensLBKnee)
      ),
      M.chain(
        M.setSpeed(-1, lensLFHip),
        M.setSpeed(-1, lensLMHip),
        M.setSpeed(-1, lensLBHip),
        M.setSpeed(-1, lensLFKnee),
        M.setSpeed(-1, lensLMKnee),
        M.setSpeed(-1, lensLBKnee)
      ),
      M.anyPass(
        M.until(M.isAngle(0), lensLFHip),
        M.until(M.isAngle(0), lensLMHip),
        M.until(M.isAngle(0), lensLBHip)
      ),
      M.stop
    ];
  }

}

// Decorate the static accessors (or the property) 'movements'
// The goal is to memoize this accessor and store it's result.
// Every consecutive call to this accessor will return the stored result.
AntEngine.states.forEach(decorateAccessorStatic(memoize, 'movements'));
