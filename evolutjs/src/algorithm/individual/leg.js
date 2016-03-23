/**
 * Partial genotype leg module.
 *
 * @module algorithm/genotype/individual/leg
 * @see module:algorithm/genotype/genotype
 */

import L  from 'partial.lenses';
import { compose, isNil, over, unless, view } from 'ramda';
import Random  from 'random-js';

import { PartialGenotype } from '../genotype/genotype';
import Foot  from './foot';
import { KneeJoint } from './joint';

const random = new Random(Random.engines.mt19937().autoSeed());

const lensMassfactor = L.prop('massFactor');
const lensHeight = L.prop('height');
const lensHeightFactor = L.prop('heightFactor');

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
 *
 * @extends {PartialGenotype}
 */
export default class Leg extends PartialGenotype {

  /**
   * Default constructor of a Leg.
   *
   * @param {Object} options
   * @param {Number} options.massFactor
   * @param {Number} options.height
   * @param {Number} options.heightFactor
   */
  constructor(options) {

    super(options);

    this.mass = 0;
    this.massFactor = view(lensMassfactor, options);
    this.height = view(lensHeight, options) || DEFAULT_LEG_HEIGHT;
    this.heightFactor = view(lensHeightFactor, options);
  }

  /**
   * Returns the parts of the genotype.
   *
   * @return {Object}
   */
  static get parts() {
    return {
      [KneeJoint.identifier]: KneeJoint,
      [Foot.identifier]: Foot
    };
  }

  /**
   * @return {String}
   */
  static get identifier() {
    return 'leg';
  }

  /**
   * Returns a randomly seeded version of a leg.
   *
   * @param {Object} options
   * @param {Number} options.massFactor
   * @param {Number} options.height
   * @param {Number} options.heightFactor
   * @return {Object}
   */
  static seed(options) {

    const orRandom = unless(isNil, () => random.real(0.1, 0.9));

    const setter = compose(
      over(lensMassfactor, orRandom),
      over(lensHeight, orRandom),
      over(lensHeightFactor, orRandom)
    );

    return super.seed(setter(options));
  }

}
