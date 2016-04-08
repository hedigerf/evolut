/**
 * Movement engine module.
 *
 * @module engine/engine
 */

import { forEach, nth } from 'ramda';
import { resolveMovementDescriptor } from './movement';

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
   * @param {Number} time The current world time
   * @return {Phenotype}
   */
  static step(phenotype, time) {

    const descriptor = nth(phenotype.engine.current, phenotype.engine.descriptor.movements);
    const movement = resolveMovementDescriptor(descriptor);
    const moved = movement(phenotype, time);

    if (moved) {
      phenotype.engine.current = this.nextState(phenotype);
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
    return (phenotype.engine.current + 1) % phenotype.engine.descriptor.movements.length;
  }

}

/**
 * Represents a feedback event.
 */
export class Feedback {

  /**
   * This callback is fired when an impact event was triggered in the current world.
   *
   * @param {p2.Event} event The event object
   * @param {p2.World} world The world
   * @param {Phenotype} phenotype The phenotype
   */
  static onImpact(event, world, phenotype) {
    console.log(event.type + ': ' + phenotype.identifier);
    Engine.step(phenotype, world.currentTime);
  }

  /**
   * Register a callback when a phenotype is involved in a collision.
   *
   * @param {p2.World} world The world
   * @param {Phenotype} phenotype The phenotype
   */
  static register(world, phenotype) {

    // Get the lower leg bodies
    const lowerLegs = [
      phenotype.bodies[3],
      phenotype.bodies[5],
      phenotype.bodies[7],
      phenotype.bodies[9],
      phenotype.bodies[11],
      phenotype.bodies[13]
    ];

    world.on('impact', (event) => {

      // Check if the phenotype body is involved in this contact event.
      if (lowerLegs.find((b) => event.bodyA === b || event.bodyB === b)) {
        this.onImpact(event, world, phenotype);
      }

    });

  }

}
