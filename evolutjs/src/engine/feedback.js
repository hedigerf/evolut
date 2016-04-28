/**
 * Provides a feedback interface to an engine.
 *
 * @module engine/feedback
 */

import Engine from './engine';

/**
 * Describes an engine feedback.
 *
 * @typedef {Object} FeedbackDescriptor
 * @property {FeedbackType} type
 * @property {String} action
 */

/**
 * Feedback types.
 *
 * @enum {Number}
 */
export const FeedbackType = {
  Impact: 1
};

/**
 * Feedback actions.
 *
 * @enum {Number}
 */
export const FeedbackAction = {
  Step: 1
};

/**
 * Represents a feedback event.
 */
export default class Feedback {

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

  /**
   * Returns the action responsible for handling an event.
   *
   * @protected
   * @param {FeedbackDescriptor} descriptor
   * @return {Number}
   */
  static getEventAction({ action }) {
    switch (action) {

      case FeedbackAction.Step:
        return Engine.step;

    }
  }

  /**
   * Returns the type responsible for handling an event.
   *
   * @protected
   * @param {FeedbackDescriptor} descriptor
   * @return {Number}
   */
  static getEventType({ type }) {
    switch (type) {

      case FeedbackType.Impact:
        return 'impact';

    }
  }

  /**
   * Register an engine feedback event.
   *
   * @param {p2.World} world
   * @param {FeedbackDescriptor} descriptor
   * @param {Phenotype} phenotype
   * @param {Array<p2.Body>} bodies
   */
  static register(world, descriptor, phenotype, bodies) {

    const action = this.getEventAction(descriptor);
    const type = this.getEventType(descriptor);

    world.on(type, (event) => {

      if (bodies.find((b) => event.bodyA === b || event.bodyB === b)) {
        action(event, world, phenotype);
      }

    });

  }

}
