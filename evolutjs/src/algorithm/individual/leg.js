'use strict';

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
   * @override
   * @static
   * @return {Object}
   */
  static get parts() {
    return {
      [KneeJoint.identifier]: KneeJoint,
      [Foot.identifier]: Foot
    };
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
   * @param {Object} options
   * @param {Number} options.massFactor
   * @param {Number} options.height
   * @param {Number} options.heightFactor
   * @return {Object}
   */
  static seed(options) {

    const orRandom = unless(isNil, _ => random.real(0.1, 0.9));

    const setter = compose(
      over(lensMassfactor, orRandom),
      over(lensHeight, orRandom),
      over(lensHeightFactor, orRandom)
    );

    return super.seed(setter(options));
  }

}
