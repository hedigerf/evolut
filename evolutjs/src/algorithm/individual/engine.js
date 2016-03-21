'use strict';

import L  from 'partial.lenses';
import { set, view } from 'ramda';
import { PartialGenotype } from '../genotype/genotype';

const lensType = L.prop('type');

/**
 * Represents the engine part of an individual.
 * The engine is responsible for the movement of the legs.
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
    this.type = view(lensType, options);
  }

  /**
   * Returns the identifier for a partial genotype.
   *
   * @override
   * @static
   * @return {String}
   */
  static get identifier() {
    return 'engine';
  }

  /**
   * Returns a randomly seeded version of a genotype.
   *
   * @override
   * @static
   * @param {Object} options
   * @param {String} options.type
   * @return {Object}
   */
  static seed(options) {
    const type = view(lensType, options) || 'ant';
    return super.seed(set(lensType, type, options));
  }

}
