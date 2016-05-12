/**
 * Provides a feedback interface to an engine.
 *
 * @module engine/feedback
 */

import { curry, when } from 'ramda';
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
  Impact: 1,
  Ascent: 2,
  Descent: 4
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
 * Holds all currently registered events.
 *
 * @type {Map<String, function>}
 */
const events = new Map();

/**
 * Tests if an event concerns a list of bodies.
 *
 * @protected
 * @param {p2.Event} event
 * @param {Array<p2.Body>} bodies
 * @return {Boolean}
 */
const concerns = curry(
  (bodies, event) => bodies.find((b) => event.bodyA === b || event.bodyB === b)
);

/**
 * Represents a feedback event.
 */
export default class Feedback {

  /**
   * @param {p2.World} world The world
   * @param {Phenotype} phenotype The phenotype
   * @return {function(Object)}
   */
  static step(world, phenotype) {
    return (event) => {
      console.log(event.type + ': ' + phenotype.identifier);
      Engine.step(phenotype, world.currentTime, event);
    };
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
        return Feedback.step;

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

      case FeedbackType.Ascent:
        return 'ascent';

      case FeedbackType.Descent:
        return 'descent';

    }
  }

  /**
   * Register an engine feedback event.
   *
   * @param {FeedbackDescriptor} descriptor The feedback descriptor
   * @param {p2.World} world The world to attach the event to
   * @param {Phenotype} phenotype The phenotype
   * @param {Array<p2.Body>} bodies
   */
  static register(descriptor, world, phenotype, bodies) {

    const type = this.getEventType(descriptor);
    const action = this.getEventAction(descriptor);
    const actOn = when(concerns(bodies), action(world, phenotype));

    events.set(phenotype.identifier + type, actOn);

    world.on(type, actOn);
  }

  /**
   * Removes a registered engine feedback event.
   *
   * @param {FeedbackDescriptor} descriptor The feedback descriptor
   * @param {p2.World} world The world to attach the event to
   * @param {Phenotype} phenotype The phenotype
   */
  static unregister(descriptor, world, phenotype) {

    const type = this.getEventType(descriptor);
    const feedback = events.get(phenotype.identifier + type);

    world.off(type, feedback);
  }

}
