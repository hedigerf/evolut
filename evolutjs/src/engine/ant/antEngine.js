/**
 * Ant movement engine module.
 *
 * @module engine/ant/antEngine
 * @see module:engine/engine
 */

import L from 'partial.lenses';
import { lens } from 'ramda';

import Engine, { MovementPhase } from '../engine';
import * as M from '../movement';
import { ANGLE_MAX, ANGLE_MIN } from '../../algorithm/individual/joint';


const immLens = key => lens(x => x.get(key), (val, x) => x.set(key, val));

const lensJointsMap = L.prop('jointsMap');

const lensFront = immLens('front');
const lensMiddle = immLens('middle');
const lensBack = immLens('back');

const lensHip = L.prop('hip');

const lensLeftJoints = L.compose(lensJointsMap, immLens('left'));
const lensLeftFrontJoint = L.compose(lensLeftJoints, lensFront);
const lensLeftMiddleJoint = L.compose(lensLeftJoints, lensMiddle);
const lensLeftBackJoint = L.compose(lensLeftJoints, lensBack);

const lensRightJoints = L.compose(lensJointsMap, immLens('right'));
const lensRightFrontJoint = L.compose(lensRightJoints, lensFront);
const lensRightMiddleJoint = L.compose(lensRightJoints, lensMiddle);
const lensRightBackJoint = L.compose(lensRightJoints, lensBack);


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
    return [Phase0];
  }

  /**
   * Executes a single step of the engine.
   *
   * @param {Phenotype} phenotype Applies the movement of this engine to this phenotype.
   * @param {Number} time The current world time.
   */
  static initialStep(phenotype) {

    const initialSpeed = 0;

    const lensLFHip = L.compose(lensLeftFrontJoint, lensHip);
    const lensLMHip = L.compose(lensLeftMiddleJoint, lensHip);
    const lensLBHip = L.compose(lensLeftBackJoint, lensHip);

    M.chain(
      M.setAngles(ANGLE_MIN, ANGLE_MAX, lensLFHip),
      M.setAngles(ANGLE_MIN, ANGLE_MAX, lensLMHip),
      M.setAngles(ANGLE_MIN, ANGLE_MAX, lensLBHip),
      M.lockAngleToZero(L.compose(lensRightFrontJoint, lensHip)),
      M.lockAngleToZero(L.compose(lensRightMiddleJoint, lensHip)),
      M.lockAngleToZero(L.compose(lensRightBackJoint, lensHip)),
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
    return antPhase0Movements;
  }

}

const SPEED = 2;
const antPhase0Movements = [
  M.chain(
    M.setSpeed(SPEED, L.compose(lensLeftFrontJoint, lensHip)),
    M.setSpeed(SPEED, L.compose(lensLeftMiddleJoint, lensHip)),
    M.setSpeed(SPEED, L.compose(lensLeftBackJoint, lensHip))
  ),
  M.chain(
    M.until(M.isMaxAngle, L.compose(lensLeftFrontJoint, lensHip)),
    M.until(M.isMaxAngle, L.compose(lensLeftMiddleJoint, lensHip)),
    M.until(M.isMaxAngle, L.compose(lensLeftBackJoint, lensHip))
  ),
  M.chain(
    M.setSpeed(-SPEED, L.compose(lensLeftFrontJoint, lensHip)),
    M.setSpeed(-SPEED, L.compose(lensLeftMiddleJoint, lensHip)),
    M.setSpeed(-SPEED, L.compose(lensLeftBackJoint, lensHip))
  ),
  M.chain(
    M.until(M.isMinAngle, L.compose(lensLeftFrontJoint, lensHip)),
    M.until(M.isMinAngle, L.compose(lensLeftMiddleJoint, lensHip)),
    M.until(M.isMinAngle, L.compose(lensLeftBackJoint, lensHip))
  ),
  M.chain(
    M.setSpeed(SPEED, L.compose(lensLeftFrontJoint, lensHip)),
    M.setSpeed(SPEED, L.compose(lensLeftMiddleJoint, lensHip)),
    M.setSpeed(SPEED, L.compose(lensLeftBackJoint, lensHip))
  )
];
