/**
 * Provides movement functionality for engines.
 *
 * @module engine/movement
 */

import { compose } from 'ramda';

import MovementPhase from './movementPhase';
import { Phenotype } from '../render/object/individual/phenotype';

/**
 * Represents a single movement of a phonotype.
 * A movement could be locking the angle of a joint.
 * Or setting the speed of joint's motor.
 */
export default class Movement {

  /**
   * Apply the movemement to a phenotype.
   *
   * @param {Phenotype} phenotype The target phenotype
   * @return {Phenotype}
   */
  static move(phenotype) {

    const phase = phenotype.phase;

    if (phase.isComplete(phenotype)) {
      phenotype.phase = phase.next;
    }

    return phenotype;
  }

  static moveIf(pred, phenotype) {
    if (pred(phenotype)) {
      return this.move(phenotype);
    }
    return this;
  }

  static feedback(object) {
    // TODO
    // apply the provided feedback
    // to the engine and the phenoytpe
  }

  /**
   * Returns all phases of this movement.
   *
   * @return {Array<MovementPhase>}
   */
  static get phases() {
    return [];
  }

}
