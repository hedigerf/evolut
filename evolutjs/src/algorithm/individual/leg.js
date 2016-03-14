'use strict';

import Random from 'random-js';

import { PartialGenotype } from './genotype';
import { KneeJoint } from './joint';
import Foot from './foot';

const random = new Random(Random.engines.mt19937().autoSeed());

/**
 * Default height for of a leg.
 *
 * @type {Number}
 */
const DEFAULT_LEG_HEIGHT = 10;

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
  constructor({ mass, massFactor, height = DEFAULT_LEG_HEIGHT, heightFactor, joint } = {}) {

    super();

    this.mass = mass;
    this.massTigh = mass * massFactor;
    this.massShank = mass - this.massTigh;

    this.height = height;
    this.heightThigh = height * heightFactor;
    this.heightShank = heightFactor - this.heightShank;

    this.joint = new KneeJoint(joint);

    this.foot = new Foot();
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
   * @param {Number} mass The mass of the leg.
   * @return {Object}
   */
  static seed(mass) {
    return {
      mass: mass,
      massFactor: random.real(0.1, 0.9),
      height: random.integer(1, 10),
      heightFactor: random.real(0.1, 0.9)
    };
  }

}
