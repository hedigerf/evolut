/**
 * Movement engine module.
 *
 * @module engine/engine
 */

import * as L from 'partial.lenses';
import { aperture, compose, find, forEach, has, keys, memoize, nth, range, take, view, zip } from 'ramda';
import { isCompoundMovement, resolveMovementDescriptor } from './movement';
import { isEven, isOdd } from '../util/number';
import { Sides, Types } from './lenses';
import Feedback from './feedback';

/**
 * All registered feedbacks.
 *
 * @type {Map<String, FeedbackDescriptor>}
 */
const registeredFeedbacks = new Map();

/**
 * Body index filters.
 *
 * @type {Array<function(n: Numer): Boolean>}
 */
const bodyFilters = [isEven, isOdd];

/**
 * Filter an array by indices fulfilling a predicate.
 *
 * @function
 * @param {function(index: Number)} filter
 * @return {function(values: Array<*>)}
 */
const filterIndex = (filter) => (values) => values.filter((_, i) => filter(i));

/**
 * Test the first element of an array if it is equal to a value.
 *
 * @function
 * @param {*} to Compare the first elment to this value
 * @return {function(values: Array<*>): Boolean}
 */
const isFirstEqual = (to) => ([first]) => first === to;

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
   * Returns the resolved current movement descriptor.
   *
   * @protected
   * @param {Phenotype} phenotype The phenotype
   * @return {Movement}
   */
  static currentMovementDescritpor(phenotype) {
    return nth(phenotype.engine.current, phenotype.engine.descriptor.movements);
  }

  /**
   * Returns the resolved current movement.
   *
   * @protected
   * @param {Phenotype} phenotype The phenotype
   * @return {Movement}
   */
  static resolveCurrentMovement(phenotype) {

    const descriptor = this.currentMovementDescritpor(phenotype);
    const movement = resolveMovementDescriptor(descriptor);

    return movement;
  }

  /**
   * Returns a list of paired leg part indices.
   *
   * @protected
   * @param {Number} [legCount=6] Number of legs
   * @return {Array<Number>}
   */
  static legPartIndices(legCount = 6) {

    const joints = 2;
    const start = 2;
    const end = start + legCount * joints;

    const indices = aperture(joints, range(start, end));

    return indices;
  }

  /**
   * Returns the index to use in the body list of a phenotype.
   *
   * @param {LensDescriptor} descriptor The lens descriptor
   * @return {Number}
   */
  static lensDescriptorToBodyIndex({ index, side, type }) {

    const [, filterSide] = find(isFirstEqual(side), zip(keys(Sides), bodyFilters));
    const [, filterType] = find(isFirstEqual(type), zip(keys(Types), bodyFilters));

    // Transform the paired indices list to a single number
    // [ [2, 3], [4, 5], ... ] -> [ [3], [5], ... ] -> [5] -> 5
    const findBodyIndex = compose(
      take(1),
      filterIndex(filterType),
      nth(index),
      filterIndex(filterSide)
    );

    return findBodyIndex(this.legPartIndices());
  }

  /**
   * Returns a transformed lens descriptor.
   *
   * @protected
   * @param {LensDescriptor} descriptor The lens descriptor
   * @return {Lens}
   */
  static transformLensDescriptorToPhenotypeBodyLens(descriptor) {
    return L.index(this.lensDescriptorToBodyIndex(descriptor));
  }

  /**
   * Registers a feedback for the current movement.
   *
   * @protected
   * @param {Phenotype} phenotype The phenotype
   * @param {SimulationWorld} world The current world
   */
  static registerFeedback(phenotype, world) {

    if (isFeedbackKeyRegistered(phenotype)) {
      return;
    }

    const feedback = { action: 1, type: 1 };
    const { lens } = this.currentMovementDescritpor(phenotype);
    const bodyLens = this.transformLensDescriptorToPhenotypeBodyLens(lens);
    const bodies = [view(bodyLens, phenotype)];
    const key = createFeedbackKey(phenotype);

    registeredFeedbacks.set(key, feedback);

    Feedback.register(feedback, world, phenotype, bodies);
  }

  /**
   * Removes a feedback for the current movement.
   *
   * @protected
   * @param {Phenotype} phenotype The phenotype
   * @param {SimulationWorld} world The current world
   */
  static unregisterFeedback(phenotype, world) {

    if (!isFeedbackKeyRegistered(phenotype)) {
      return;
    }

    const key = createFeedbackKey(phenotype);
    const feedback = registeredFeedbacks.get(key);

    registeredFeedbacks.delete(key);

    Feedback.unregister(feedback, world, phenotype);
  }

  /**
   * Returns the index of the next state.
   *
   * @protected
   * @protected
   * @param {Phenotype} phenotype
   * @return {Number} The index of the next state
   */
  static nextState(phenotype) {
    return (phenotype.engine.current + 1) % phenotype.engine.descriptor.movements.length;
  }

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

    const movement = this.resolveCurrentMovement(phenotype);

    if (isCompoundMovement(movement)) {
      // this.registerFeedback(phenotype, world);
    }

    if (movement(phenotype, world.currentTime)) {
      // this.unregisterFeedback(phenotype, world);
      phenotype.engine.current = this.nextState(phenotype);
    }

    return phenotype;
  }

}

// Cache the results of this static functions.
Engine.legPartIndices = memoize(Engine.legPartIndices);
