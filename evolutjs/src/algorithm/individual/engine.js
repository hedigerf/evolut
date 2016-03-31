/**
 * Partial genotype engine module.
 *
 * @module algorithm/genotype/individual/engine
 * @see module:algorithm/genotype/genotype
 */

import L  from 'partial.lenses';
import { always, set, view } from 'ramda';

import AntEngine from '../../engine/ant/antEngine';
import { PartialGenotype } from '../genotype/genotype';

/**
 * Lens for the engine type.
 *
 * @param {Object} The option object.
 * @return {Lens} The engine type.
 */
const lensType = L.prop('type');

/**
 * Lens for the movement description.
 *
 * @param {Object} The option object.
 * @return {Lens} The engine type.
 */
const lensMovement = L.prop('movement');

/**
 * Returns the constructor for an engine.
 *
 * @param {String} type The engine type.
 * @return {Engine} The engine.
 */
const getEngine = always(AntEngine);

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

    this.movement = [
      [
        ['id', [1]],
        ['blub', [2, 3]]
      ]
    ];

    /**
     * @member
     * @type {Array<Array<String|Array<*>>>}
     */
    this.movement = view(lensMovement, options);
    this.type = getEngine(view(lensType, options));
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
    const type = view(lensType, options) || 'ant';
    return super.seed(set(lensType, type, options));
  }

}
