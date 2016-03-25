/**
 * Ant movement engine module.
 *
 * @module engine/ant/engine
 * @see module:engine/engine
 */

import L from 'partial.lenses';

import * as GL from '../../algorithm/genotype/lenses';
import Engine, { MovementPhase } from '../engine';
import { lockAngleTo } from '../movement';

/**
 * Represents an abstracted version of the movement of an ant.
 *
 * @extends {Engine}
 */
export default class AntEngine extends Engine {

  /**
   * Returns all phases of this movement.
   *
   * @protected
   * @return {Array<MovementPhase>}
   */
  static get phases() {
    return [];
  }

}

const ll = L.compose(L.prop('instanceParts'), GL.lensFirstHipJoint);

export class AntMovementPhase0 extends MovementPhase {

  /**
   * Returns all movements of this phase.
   *
   * @protected
   * @return {Array<Movement>}
   */
  static get movements() {
    return [lockAngleTo(Math.PI / 2, ll)]; // eslint-disable-line no-magic-numbers
  }

}
