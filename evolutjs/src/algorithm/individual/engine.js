/**
 * Partial genotype engine module.
 *
 * @module algorithm/genotype/individual/engine
 * @see module:algorithm/genotype/genotype
 */

import L  from 'partial.lenses';
import { set, view } from 'ramda';

import { PartialGenotype } from '../genotype/genotype';

/**
 * Lens for the movement description.
 *
 * @param {Object} The option object.
 * @return {Lens} The engine type.
 */
const lensMovement = L.prop('movement');

/**
 * Represents the engine part of an individual.
 * The engine is responsible for the movement of the legs.
 *
 * @extends {PartialGenotype}
 */
export default class Engine extends PartialGenotype {

  /**
   * Default constructor for an engine.
   *
   * @param {Object} options
   * @param {String} options.type
   */
  constructor(options) {

    super(options);

    /**
     * Describes the movemement phases and every movement of each phase.
     *
     * @type {Array<Array<String|Array<*>>>}
     */
    this.movement = view(lensMovement, options);
  }

  /**
   * Returns the identifier for a partial genotype.
   *
   * @return {String}
   */
  static get identifier() {
    return 'engine';
  }

  /**
   * Returns a randomly seeded version of a genotype.
   *
   * @param {Object} options
   * @param {String} options.type
   * @return {Object}
   */
  static seed(options) {
    const movement = view(lensMovement, options) || [];
    return super.seed(set(lensMovement, movement, options));
  }

}
