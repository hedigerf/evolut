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

const lensLFHip = L.compose(CL.lensLeftFrontJoint, CL.lensHip);
const lensLMHip = L.compose(CL.lensLeftMiddleJoint, CL.lensHip);
const lensLBHip = L.compose(CL.lensLeftBackJoint, CL.lensHip);

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
    return [Phase0, Phase1];
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
      M.lockAngleToZero(L.compose(CL.lensRightFrontJoint, CL.lensHip)),
      M.lockAngleToZero(L.compose(CL.lensRightMiddleJoint, CL.lensHip)),
      M.lockAngleToZero(L.compose(CL.lensRightBackJoint, CL.lensHip)),
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
    const speedPhase = 2;
    return [
      M.chain(
        M.setSpeed(speedPhase, lensLFHip),
        M.setSpeed(speedPhase, lensLMHip),
        M.setSpeed(speedPhase, lensLBHip)
      ),
      M.chain(
        M.until(M.isMaxAngle, lensLFHip),
        M.until(M.isMaxAngle, lensLMHip),
        M.until(M.isMaxAngle, lensLBHip)
      ),
      M.chain(
        M.setSpeed(-speedPhase, lensLFHip),
        M.setSpeed(-speedPhase, lensLMHip),
        M.setSpeed(-speedPhase, lensLBHip)
      ),
      M.chain(
        M.until(M.isMinAngle, lensLFHip),
        M.until(M.isMinAngle, lensLMHip),
        M.until(M.isMinAngle, lensLBHip)
      ),
      M.chain(
        M.setSpeed(speedPhase, lensLFHip),
        M.setSpeed(speedPhase, lensLMHip),
        M.setSpeed(speedPhase, lensLBHip)
      )
    ];
  }

}

/**
 * Represents the first phase of an ant engine's movement.
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
    const speedPhase = 1;
    return [
      M.chain(
        M.setSpeed(speedPhase, lensLFHip),
        M.setSpeed(speedPhase, lensLMHip),
        M.setSpeed(speedPhase, lensLBHip)
      ),
      M.chain(
        M.until(M.isMaxAngle, lensLFHip),
        M.until(M.isMaxAngle, lensLMHip),
        M.until(M.isMaxAngle, lensLBHip)
      ),
      M.chain(
        M.setSpeed(-speedPhase, lensLFHip),
        M.setSpeed(-speedPhase, lensLMHip),
        M.setSpeed(-speedPhase, lensLBHip)
      ),
      M.chain(
        M.until(M.isMinAngle, lensLFHip),
        M.until(M.isMinAngle, lensLMHip),
        M.until(M.isMinAngle, lensLBHip)
      ),
      M.chain(
        M.setSpeed(speedPhase, lensLFHip),
        M.setSpeed(speedPhase, lensLMHip),
        M.setSpeed(speedPhase, lensLBHip)
      )
    ];
  }

}
