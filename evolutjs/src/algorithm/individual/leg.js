'use strict';

import { PartialGenotype } from 'genotype';
import Joint from './joint';
import Foot from './foot';

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
   * @param {Number} mass The mass of a leg
   * @param {Number} massFactorThigh Factor of the thigh's mass
   * @param {Number} heightThigh Height of the thigh
   * @param {Joint} joint The knee joint
   */
  constructor(mass, massFactorThigh, heightThigh, joint) {

    super();

    this.mass = mass;
    this.massTigh = mass * massFactorThigh;
    this.massShank = mass - this.massTigh;

    this.height = DEFAULT_LEG_HEIGHT;
    this.heightShank =   this.height - heightThigh;
    this.heightThigh = heightThigh;

    this.joint = new Joint(joint);

    this.foot = new Foot();
  }

}
