/**
 * Partial genotype engine module.
 *
 * @module algorithm/genotype/individual/engine
 * @see module:algorithm/genotype/genotype
 */

import L  from 'partial.lenses';
import { apply, head, set, tail, view } from 'ramda';

import { antEngineMovements } from '../../engine/ant/antEngine';
import MovementEngine, { MovementPhase } from '../../engine/engine';
import * as M from '../../engine/movement';
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

    console.log(view(lensMovement, options));

    /**
     * Describes the movemement phases and every movement of each phase.
     *
     * @type {Engine}
     */
    this.movementEngine = this.translateMovementsIntoEngine(antEngineMovements);
  }

  /**
   * @param {Array<Array<String|Array<*>>>} movements
   * @return {Engine}
   */
  translateMovementsIntoEngine(movements) {

    const initialStep = apply(M.allPass, head(movements));
    const states = tail(movements).map(m => class extends MovementPhase {

      static get movements() {
        return m;
      }

    });

    return class extends MovementEngine {

      static get states() {
        return states;
      }

      static initialStep(phenotype) {
        initialStep(phenotype);
      }

    };
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
