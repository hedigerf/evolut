/**
 * Ant movement engine module.
 *
 * @module engine/ant/engine
 * @see module:engine/engine
 */

import L from 'partial.lenses';

import * as GL from '../../algorithm/genotype/lenses';
import Engine, { MovementPhase } from '../engine';
import * as M from '../movement';

const ll = L.compose(L.prop('instanceParts'), GL.lensFirstHipJoint);

/**
 * Represents an abstracted version of the movement of an ant.
 *
 * @extends {Engine}
 */
export default class AntEngine extends Engine {

  /**
   * Returns all states of this movement.
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
   * @return {Phenotype}
   */
  static initialStep(phenotype) {

    const jointsMap = phenotype.jointsMap;

    const leftSide = jointsMap.get('left');
    const rightSide = jointsMap.get('right');

    const setLimits = (side) => {

      const leftBack = side.get('back').hip;
      const leftMiddle = side.get('middle').hip;
      const leftFront = side.get('front').hip;

      M.setAngle(leftBack);
      M.setAngle(leftFront);
      M.setAngle(leftMiddle);
    };

    const setLimits0 = (side) => {

      const leftBack = side.get('back').hip;
      const leftMiddle = side.get('middle').hip;
      const leftFront = side.get('front').hip;

      M.setAngle(leftBack, 0, 0);
      M.setAngle(leftFront, 0, 0);
      M.setAngle(leftMiddle, 0, 0);
    };

    const setSpeed = (side) => {

      side.get('back').hip.setMotorSpeed(2);
      side.get('middle').hip.setMotorSpeed(2);
      side.get('front').hip.setMotorSpeed(2);

    };

    setLimits0(rightSide);
    setLimits(leftSide);
    setSpeed(leftSide);

    return phenotype;
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
    return [M.lockAngleTo(Math.PI / 2, ll)]; // eslint-disable-line no-magic-numbers
  }

  /**
   * Progresses the movement phase of a phenotype.
   *
   * @param {Phenotype} phenotype
   * @param {Number} time The current world time.
   * @return {Phenotype}
   */
  static step(phenotype, time) { // eslint-disable-line no-unused-vars

    const leftSide = phenotype.jointsMap.get('left');

    this.stepForward(phenotype, leftSide);

    return phenotype;
  }

  static stepForward(phenotype, joints) {

    const hipBack = joints.get('back').hip;
    const hipMiddle = joints.get('middle').hip;
    const hipFront = joints.get('front').hip;

    const _speed = 3;

    const moveForwardUntil = hip => {

      const angle = hip.angle;
      const index = hip.equations.indexOf(hip.motorEquation);
      const speed = hip.equations[index].relativeVelocity;

      if (M.isMaxAngle(hip, angle) && speed > 0) {
        hip.setMotorSpeed(-_speed);
      } else if (M.isMinAngle(hip, angle) && speed < 0) {
        hip.setMotorSpeed(_speed / 2);
      }
    };

    moveForwardUntil(hipBack);
    moveForwardUntil(hipMiddle);
    moveForwardUntil(hipFront);
  }

}
