'use strict';

import { repeat } from 'ramda';

import Body from './body';
import Engine from './engine';
import Genotype from '../genotype/genotype';
import { HipJoint } from './joint';
import Leg from './leg';

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
const IDENTIFIER_LEGS = 'legs';

/**
 * Represents an Individual.
 * This is the genotype of an inidividual.
 * An individual consists of multiple leg pairs.
 * The Individual class maintains knowledge of it's body and all legs.
 * Including the joints which connect the legs to the body.
 */
export default class Individual extends Genotype {

  /**
   * Returns the parts of the genotype.
   *
   * @override
   * @static
   * @return {Object}
   */
  static get parts() {
    return {
      [Body.indentifier]: Body,
      [Engine.identifier]: Engine,
      [IDENTIFIER_LEGS]: [
        repeat({
          [HipJoint.identifier]: HipJoint,
          [Leg.identifier]: Leg
        }, DEFUALT_LEG_COUNT)
      ]
    };
  }

}
