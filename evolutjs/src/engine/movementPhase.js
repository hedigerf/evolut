/**
 * Movement phase module
 *
 * @module engine/MovementPhase
 * @see module:engine/movement
 */

import { allPass } from 'ramda';

/**
 * Represents a phase of a whole movement.
 * A movement phase resebles a state in a state machine.
 * The phase is complete once all predicates are fulfilled.
 */
export default class MovementPhase {

  /**
   * Transition to the next phase.
   *
   * @param {Phenotype} phenotype
   * @return {MovementPhase}
   */
  static transition(phenotype) {
    if (this.isComplete(phenotype)) {
      return this.next;
    }
    return this;
  }

  /**
   * Returns the list of all predicates for this phase.
   *
   * @return {Array<function(Phenotype): Boolean>}
   */
  static get predicates() {
    return [];
  }

  /**
   * Returns the next state.
   *
   * @return {MovementPhase} The next phase.
   */
  static get next() {
    return MovementPhase;
  }

  /**
   * Tests the predicates of the current phase.
   *
   * @param {Phenotype} phenotype
   * @return {Boolean}
   */
  static isComplete(phenotype) {
    return allPass(this.predicates)(phenotype);
  }

}
