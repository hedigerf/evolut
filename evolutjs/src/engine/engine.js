/**
 * Movement engine module.
 *
 * @module engine/engine
 */

import { forEach, has, nth } from 'ramda';
import Feedback from './feedback';
import { resolveMovementDescriptor } from './movement';

/**
 * All registered feedbacks.
 *
 * @type {Object<String>}
 */
const registeredFeedbacks = {};

/**
 * Returns a key for a combination of phenotype an it's current movement.
 *
 * @param {Phenotype} phenotype The phenotype
 * @return {String} The key for this combinatio of phenotype and current movement
 */
function createFeedbackKey(phenotype) {
  return phenotype.identifier + phenotype.engine.current.toString();
}

/**
 * Returns if this phenotype and the current movement are registered.
 *
 * @param {Phenotype} phenotype The phenotype
 * @return {Boolean}
 */
function isFeedbackKeyRegistered(phenotype) {
  return has(createFeedbackKey(phenotype), registeredFeedbacks);
}

/**
 * Represents an engine.
 * It's responsibility is moving an phenotype's legs.
 * An engine consists of multiple movements.
 * A movement itself may consist of multiple movements.
 */
export default class Engine {

  /**
   * Applies the initial step of an engine.
   * This most often comes down to initialize the movement,
   * angles and velocitities of constraints, and the position of bodies.
   *
   * @param {Phenotype} phenotype Applies the movement of this engine to this phenotype.
   */
  static initialStep(phenotype) {
    forEach(
      (descriptor) => resolveMovementDescriptor(descriptor)(phenotype, 0),
      phenotype.engine.descriptor.initial
    );
  }

  /**
   * Executes a single step of the engine.
   *
   * @param {Phenotype} phenotype Applies the movement of this engine to this phenotype
   * @param {SimulationWorld} world The current world
   * @param {Object} [event] The event that caused the step
   * @return {Phenotype}
   */
  static step(phenotype, world, event) { // eslint-disable-line no-unused-vars

    const descriptor = nth(phenotype.engine.current, phenotype.engine.descriptor.movements);
    const movement = resolveMovementDescriptor(descriptor);
    const moved = movement(phenotype, world.currentTime);

    if (moved) {
      phenotype.engine.current = this.nextState(phenotype);
      // TODO register feedback
    }

    return phenotype;
  }

  /**
   * Registers a feedback for the current movement.
   *
   * @param {Phenotype} phenotype The phenotype
   * @param {SimulationWorld} world The current world
   */
  static registerFeedback(phenotype, world) {

    if (isFeedbackKeyRegistered(phenotype)) {
      return;
    }

    const descriptor = {};
    const bodies = [];
    const key = createFeedbackKey(phenotype);

    registeredFeedbacks[key] = descriptor;

    Feedback.register(descriptor, world, phenotype, bodies);
  }

  /**
   * Removes a feedback for the current movement.
   *
   * @param {Phenotype} phenotype The phenotype
   * @param {SimulationWorld} world The current world
   */
  static unregisterFeedback(phenotype, world) {

    if (!isFeedbackKeyRegistered(phenotype)) {
      return;
    }

    const descriptor = registeredFeedbacks[key];
    const key = createFeedbackKey(phenotype);

    Feedback.unregister(descriptor, world, phenotype);

  }

  /**
   * Returns the index of the next state.
   *
   * @protected
   * @param {Phenotype} phenotype
   * @return {Number} The index of the next state
   */
  static nextState(phenotype) {
    return (phenotype.engine.current + 1) % phenotype.engine.descriptor.movements.length;
  }

}
