/**
 * Movement engine module.
 *
 * @module engine/engine
 */

import { apply, append, forEach, nth } from 'ramda';

import { getLensById } from './constraintLenses';
import Identifiable from '../types/identifiable';
import { getMovementById } from './movement';

/**
 * @typedef {{
 *   id: String,
 *   lensId: String,
 *   params: Array<*>
 * }} MovementDescriptor
 */

/**
 * Represents a single movement of a phonotype.
 * A movement could be locking the angle of a joint.
 * Or setting the speed of joint's motor.
 *
 * @abstract
 * @extends {Identifiable}
 */
export class Movement extends Identifiable() {

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

/**
 * TODO
 *
 * @param {MovementDescriptor} descriptor
 * @return {function(Phenotype, Number): Boolean}
 */
function getMovementByDescriptor(descriptor) {

  const movement = getMovementById(descriptor.id);
  const lens = getLensById(descriptor.lensId);
  const params = append(lens, descriptor.params);

  return apply(movement, params);
}

/**
 * Represents an engine.
 * It's responsibility is moving an phenotype's legs.
 * An engine consists of multiple movements.
 * A movement itself may consist of multiple movements.
 *
 * An engine's operations should be chainable.
 * Therefore each operation must return the input it received.
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
    forEach(m => getMovementByDescriptor(m)(phenotype, 0), phenotype.engine.descriptor.initial);
  }

  /**
   * Executes a single step of the engine.
   *
   * @param {Phenotype} phenotype Applies the movement of this engine to this phenotype
   * @param {Number} time The current world time
   * @return {Phenotype}
   */
  static step(phenotype, time) {

    const descriptor = nth(phenotype.engine.current, phenotype.engine.descriptor);
    const movement = getMovementByDescriptor(descriptor);
    const moved = movement(phenotype, time);

    if (moved) {
      return this.transition(phenotype);
    }

    return phenotype;
  }

  /**
   * Returns the index of the next state.
   *
   * @protected
   * @param {Phenotype} phenotype
   * @return {Number} The index of the next state
   */
  static nextState(phenotype) {
    return (phenotype.engine.current + 1) % phenotype.engine.descriptor.length;
  }

  /**
   * Transition to the next state.
   *
   * @protected
   * @param {Phenotype} phenotype
   * @return {Phenotype}
   */
  static transition(phenotype) {
    phenotype.engine.current = this.nextState(phenotype);
    return phenotype;
  }

}
