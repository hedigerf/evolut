'use strict';

import { List } from 'immutable';

import Foot from './foot';
import { makeInfo, MassDistribution } from './massDistribution';

/**
 * Represents a leg of an indiviual.
 * A leg is made of a thigh and a shank.
 * These are connected by a knee joint.
 * The leg itself is connected to the body of an indiviudal
 * by another joint.
 * The leg maintains knowledge about the thigh, shank, knee joint
 * and the foot.
 */
export default class Leg {

  /**
   * Default constructor of a Leg.
   *
   * @param {Number} mass The mass of a leg
   * @param {Number} massFactorThigh Factor of the thigh's mass
   * @param {Number} height The total height of a leg
   * @param {Number} heightThigh Height of the thigh
   */
  constructor(mass, massFactorThigh, height, heightThigh) {

    this.mass = mass;
    this.massDistribution = new MassDistribution(
      List.of([
        makeInfo('shank', 1 - massFactorThigh),
        makeInfo('thigh', massFactorThigh)
      ])
    );

    this.height = height;
    this.heightShank = height - heightThigh;
    this.heightThigh = heightThigh;

    this.foot = new Foot();
  }

}
