/**
 * Cyclical state machine.
 *
 * @module engine/cyclicStateMachine
 */

/**
 * @typedef {{state: Number}} CyclicStateObject
 */

/**
 * Step size to the next phase.
 *
 * @type {Number}
 */
const PHASE_STEP = 1;

/**
 * Represents a state of a state machine.
 *
 * @abstract
 */
export class CyclicState {

  /**
   * Tests the predicates of the current state.
   *
   * @param {*} object
   * @return {Boolean}
   */
  static isComplete(object) { // eslint-disable-line no-unused-vars
    return true;
  }

}

/**
 * Represents a simple state machine.
 * It will cycle through the available states.
 *
 * @abstract
 */
export default class CyclicStateMachine {

  /**
   * Returns all states of this machine.
   *
   * @protected
   * @return {Array<CyclicState>}
   */
  static get states() {
    return [];
  }

  /**
   * Returns the index of the next state.
   * Cycles through the states.
   *
   * @protected
   * @param {Number} stateIndex The current state index.
   * @return {Number} The next state index.
   */
  static nextState(stateIndex) {
    return (stateIndex + PHASE_STEP) % this.states.length;
  }

  /**
   * Resets the machine.
   * Sets the state to the first of this machine.
   *
   * @param {CyclicStateObject} object
   * @return {CyclicStateObject}
   */
  static reset(object) {
    object.state = 0;
    return object;
  }

}
