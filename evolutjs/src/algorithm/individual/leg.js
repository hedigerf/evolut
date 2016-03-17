'use strict';

import { merge } from 'ramda';
import Random from 'random-js';

import { PartialGenotype } from '../genotype/genotype';
import { KneeJoint } from './joint';
import Foot from './foot';

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
   * @param {Object} options Override random values.
   * @return {Object}
   */
  static seed(options) {
    return {
      [this.identifier]: merge(this.randomSeed, super.seed(options))
    };
  }

  /**
   * Get randomized seed options.
   *
   * @private
   * @static
   * @return {Object}
   */
  static get randomSeed() {
    return {
      massFactor: random.real(0.1, 0.9),
      height: random.integer(1, 10),
      heightFactor: random.real(0.1, 0.9)
    };
  }

}
