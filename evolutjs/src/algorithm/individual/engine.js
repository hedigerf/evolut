'use strict';

import L from 'partial.lenses';
import { compose, view } from 'ramda';

import { lensPartialGenotypeOption } from '../../util/lens';
import { PartialGenotype } from '../genotype/genotype';

/**
 * Represents the engine part of an individual.
 * The engine is responsible for the movement of the legs.
 */
export default class Engine extends PartialGenotype {

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
   * @param {Array} options
   * @return {Array}
   */
  static seed(options) {

    const lensEngine = lensPartialGenotypeOption(this.identifier);
    const lensType = compose(lensEngine, L.prop('type'));

    const type = view(lensType, options) || 'ant';

    return super.seed([{
      [this.identifier]: type
    }]);
  }

}
