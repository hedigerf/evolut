/**
 * Genotype individual module.
 *
 * @module algorithm/genotype/individual/individual
 * @see module:algorithm/genotype/genotype
 */

import Body  from './body';
import distribute from '../genotype/mass';
import Engine  from './engine';
import Genotype  from '../genotype/genotype';
import { HipJoint } from './joint';
import Leg  from './leg';
import { repeat } from 'ramda';

/**
 * Default number of legs an individual posesses.
 *
 * @type {Number}
 */
const DEFUALT_LEG_COUNT = 6;

/**
 * Identifier for legs.
 *
 * @type {String}
 */
export const IDENTIFIER_LEGS = 'legs';

/**
 * Represents an Individual.
 * This is the genotype of an inidividual.
 * An individual consists of multiple leg pairs.
 * The Individual class maintains knowledge of it's body and all legs.
 * Including the joints which connect the legs to the body.
 *
 * @extends {Genotype}
 */
export default class Individual extends Genotype {

  /**
   * Constructor of an individual.
   *
   * @param {Object} genotype A seeded genotype information object
   */
  constructor(genotype) {
    super(distribute(genotype));
  }

  /**
   * Returns the parts of the genotype.
   *
   * @return {Object}
   */
  static get parts() {
    return {
      [Body.identifier]: Body,
      [Engine.identifier]: Engine,
      [IDENTIFIER_LEGS]: repeat({
        [HipJoint.identifier]: HipJoint,
        [Leg.identifier]: Leg
      }, DEFUALT_LEG_COUNT)
    };
  }

}
