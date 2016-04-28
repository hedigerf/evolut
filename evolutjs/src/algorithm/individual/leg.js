/**
 * Partial genotype leg module.
 *
 * @module algorithm/genotype/individual/leg
 * @see module:algorithm/genotype/genotype
 */

import * as L from 'partial.lenses';
import { compose, isNil, over, view, when } from 'ramda';
import Foot from './foot';
import { KneeJoint } from './joint';
import { PartialGenotype } from '../genotype/genotype';
import Random  from 'random-js';

const random = new Random(Random.engines.mt19937().autoSeed());

const lensMass = L.prop('mass');
const lensHeight = L.prop('height');
const lensWidth = L.prop('width');
const lensHeightFactor = L.prop('heightFactor');


const LEG_LOWER_LIMIT_HEIGHT = 0.6;
const LEG_UPPER_LIMIT_HEIGHT = 0.8;
const LEG_LOWER_LIMIT_HEIGHT_FACTOR = 0.4;
const LEG_UPPER_LIMIT_HEIGHT_FACTOR = 0.6;
const LEG_LOWER_LIMIT_WIDTH = 0.1;
const LEG_UPPER_LIMIT_WIDTH = 0.2;


/**
 * Represents a leg of an indiviual.
 * A leg is made of a thigh and a shank. These are connected by a knee joint.
 * The leg itself is connected to the body of an indiviudal by another joint.
 * The leg maintains knowledge about the thigh, shank, knee joint and the foot.
 *
 * @extends {PartialGenotype}
 */
export default class Leg extends PartialGenotype {


  /**
   * Constructor of a Leg.
   *
   * @param {Object} options
   * @param {Number} options.massFactor
   * @param {Number} options.height
   * @param {Number} options.heightFactor
   */
  constructor(options) {

    super(options);

    /**
     * Mass of this leg.
     *
     * @type {Number}
     */
    this.mass = view(lensMass, options);

    /**
     * Height of this leg.
     *
     * @type {Number}
     */
    this.height = view(lensHeight, options);
    /**
     * Width of this leg.
     *
     * @type {Number}
     */
    this.width = view(lensWidth, options);

    /**
     * Height factor of this leg.
     * Determines the size of the thigh and shank.
     *
     * @type {Number}
     */
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
    const orRandomHeight = when(isNil, () => random.real(LEG_LOWER_LIMIT_HEIGHT, LEG_UPPER_LIMIT_HEIGHT));
    const orRandomHeightFactor = when(isNil, () =>
      random.real(LEG_LOWER_LIMIT_HEIGHT_FACTOR, LEG_UPPER_LIMIT_HEIGHT_FACTOR));

    const orRandomWidth = when(isNil, () => {
      return random.real(LEG_LOWER_LIMIT_WIDTH, LEG_UPPER_LIMIT_WIDTH);
    });

    const setter = compose(
      over(lensHeight, orRandomHeight),
      over(lensHeightFactor, orRandomHeightFactor),
      over(lensWidth, orRandomWidth)
    );

    return super.seed(setter(options));
  }

}
