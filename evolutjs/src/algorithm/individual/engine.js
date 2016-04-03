/**
 * Partial genotype engine module.
 *
 * @module algorithm/genotype/individual/engine
 * @see module:algorithm/genotype/genotype
 */

import L  from 'partial.lenses';
import { set, view } from 'ramda';

import AntEngineDescriptor from '../../engine/type/ant';
import { PartialGenotype } from '../genotype/genotype';

/**
 * Lens for the movement description.
 *
 * @return {Lens} The engine movement.
 */
const lensDescriptor = L.prop('descriptor');

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
   * @param {String} options.descriptor
   */
  constructor(options) {

    super(options);

    /**
     * Describes the movemement.
     *
     * @type {Array<Movement>}
     */
    this.descriptor = view(lensDescriptor, options);
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
   * @param {String} options.descriptor
   * @return {Object}
   */
  static seed(options) {
    const movement = view(lensDescriptor, options) || AntEngineDescriptor;
    return super.seed(set(lensDescriptor, movement, options));
  }

}
