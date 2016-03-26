/**
 * Movement engine module.
 *
 * @module engine/engine
 */

import { nth } from 'ramda';

import CyclicalStateMachine, { CyclicalState } from './cyclicalStateMachine';

/**
 * Offset for advancing a movement index.
 *
 * @type {Number}
 */
const MOVEMENT_OFFSET = 1;

/**
 * Represents an abstract class for an engine.
 * It's responsibility is moving an phenotype's legs.
 * An engine consists of multiple movement phases.
 * A phase itself may consist of multiple movements.
 *
 * An engine's operations should be chainable.
 * Therefore each operation must return the input it received.
 *
 * @abstract
 * @extends {CyclicalStateMachine}
 */
export default class Engine extends CyclicalStateMachine {

  /**
   * Applies the initial step of an engine.
   * This most often comes down to initialize the movement,
   * angles and velocitities of constraints, and the position of bodies.
   *
   * @param {Phenotype} phenotype Applies the movement of this engine to this phenotype.
   */
  static initialStep(phenotype) {} // eslint-disable-line no-unused-vars

  /**
   * Executes a single step of the engine.
   *
   * @param {Phenotype} phenotype Applies the movement of this engine to this phenotype
   * @param {Number} time The current world time
   * @return {Phenotype}
   */
  static step(phenotype, time) {
    const state = nth(phenotype.state, this.states);
    return this.transition(state.progress(phenotype, time));
  }

  /**
   * Transition to the next phase.
   *
   * @protected
   * @param {Phenotype} phenotype
   * @return {Phenotype}
   */
  static transition(phenotype) {
    const stateIndex = phenotype.state;
    const state = nth(stateIndex, this.states);
    if (state.isComplete(phenotype)) {
      phenotype.state = this.nextState(stateIndex);
      phenotype.movement = 0;
    }
    return phenotype;
  }

}

/**
 * Represents a phase of a whole movement.
 * A movement phase resebles a state in a state machine.
 * The phase is complete once all predicates are fulfilled.
 *
 * @extends {CyclicalState}
 */
export class MovementPhase extends CyclicalState {

  /**
   * Returns all movements of this phase.
   *
   * @protected
   * @return {Array<Movement>}
   */
  static get movements() {
    return [];
  }

  /**
   * Progresses the movement phase of a phenotype.
   *
   * @param {Phenotype} phenotype
   * @param {Number} time The current world time
   * @return {Phenotype}
   */
  static progress(phenotype, time) {
    const movementIndex = phenotype.movement;
    const movement = nth(movementIndex, this.movements);
    if (movement(phenotype, time)) {
      phenotype.movement = movementIndex + MOVEMENT_OFFSET;
    }
    return phenotype;
  }

  /**
   * Tests the predicates of the current state.
   *
   * @param {*} object
   * @return {Boolean}
   */
  static isComplete(object) {
    return object.movement >= this.movements.length - MOVEMENT_OFFSET;
  }

}

/**
 * Represents a single movement of a phonotype.
 * A movement could be locking the angle of a joint.
 * Or setting the speed of joint's motor.
 */
export class Movement {

  /**
   * Apply the movemement to a phenotype.
   *
   * @param {Phenotype} phenotype The target phenotype
   * @param {Number} time The world time
   * @return {Boolean}
   */
  static move(phenotype, time) { // eslint-disable-line no-unused-vars
    return true;
  }

}
