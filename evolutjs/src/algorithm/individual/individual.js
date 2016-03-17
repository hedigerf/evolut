'use strict';

import Random from 'random-js';

import Body from './body';
import Engine from './engine';
import Genotype from '../genotype/genotype';
import { HipJoint } from './joint';
import Leg from './leg';

const random = new Random(Random.engines.mt19937().autoSeed());

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
   * @return {Array}
   */
  static get parts() {
    return [Body, [HipJoint, HipJoint, HipJoint], [Leg, Leg, Leg], Engine];
  }

  /**
   * @override
   * @static
   * @param {Number} massFactor
   * @param {Number} bodyPoints
   * @return {Object}
   */
  static seed(massFactor, bodyPoints) {

    massFactor = massFactor || random.real(0.1, 0.9);

    return super.seed({
      [Body.identifier]: {
        massFactor,
        bodyPoints
      }
    });
  }

}
