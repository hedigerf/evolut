'use strict';

import L from 'partial.lenses';
import { compose, view } from 'ramda';
import Random from 'random-js';

import Foot from './foot';
import { KneeJoint } from './joint';
import { lensPartialGenotypeOption } from '../../util/lens';
import { PartialGenotype } from '../genotype/genotype';

const random = new Random(Random.engines.mt19937().autoSeed());

/**
 * Default height for of a leg.
 *
 * @type {Number}
 */
const DEFAULT_LEG_HEIGHT = 1;

/**
 * Represents a leg of an indiviual.
 * A leg is made of a thigh and a shank.
 * These are connected by a knee joint.
 * The leg itself is connected to the body of an indiviudal
 * by another joint.
 * The leg maintains knowledge about the thigh, shank, knee joint
 * and the foot.
 */
export default class Leg extends PartialGenotype {

  /**
   * Default constructor of a Leg.
   *
   * @param {Object}
   */
  constructor({ massFactor, height = DEFAULT_LEG_HEIGHT, heightFactor } = {}) {

    super({});

    this.massTigh = massFactor;
    this.massShank = 1 - massFactor;

    this.height = height;
    this.heightThigh = height * heightFactor;
    this.heightShank = heightFactor - this.heightShank;
  }

  /**
   * Returns the parts of the genotype.
   *
   * @override
   * @static
   * @return {Array}
   */
  static get parts() {
    return [KneeJoint, Foot];
  }

  /**
   * @override
   * @static
   * @return {String}
   */
  static get identifier() {
    return 'leg';
  }

  /**
   * Returns a randomly seeded version of a leg.
   *
   * @override
   * @static
   * @param {Array} options Override random values.
   * @return {Array}
   */
  static seed(options) {

    const lensLeg = lensPartialGenotypeOption(this.identifier);
    const lensMassfactor = compose(lensLeg, L.prop('massFactor'));
    const lensHeight = compose(lensLeg, L.prop('height'));
    const lensHeightFactor = compose(lensLeg, L.prop('heightFactor'));

    const massFactor = view(lensMassfactor, options) || random.real(0.1, 0.9);
    const height = view(lensHeight, options) || random.real(0.1, 1);
    const heightFactor = view(lensHeightFactor, options) || random.real(0.1, 0.9);

    return super.seed([{
      [this.identifier]: {
        massFactor,
        height,
        heightFactor
      }
    }]);
  }

}
