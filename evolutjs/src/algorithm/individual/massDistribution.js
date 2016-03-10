'use strict';

import { Map } from 'immutable';

/**
 * Reducer function for mass information objects.
 *
 * @param {Number} mass
 * @param {Object<Number>} info
 * @return {Number}
 */
function toMass(mass, info) {
  return mass + info[Object.keys(info).shift()];
}

/**
 * Returns a mass distribution info object.
 *
 * @param {String} key The key of a object
 * @param {Number} value The percentage of the total mass
 * @return {Object<Number>}
 */
export function makeInfo(key, value) {
  const info = {};
  info[key] = value;
  return info;
}

/**
 * Distributes ...
 */
export default class MassDistribution {

  /**
   * Default constructor.
   *
   * @param {List<Object<Number>>} distributionInfo Set of mass distribution information
   */
  constructor(distributionInfo) {
    this.mass = distributionInfo.reduce(toMass, 0);
    this.massMap = new Map(distributionInfo.toMap());
  }

  /**
   * Returns the mass of a object identified by a key.
   *
   * @param {String} key
   * @return {Number}
   */
  getMass(key) {
    return this.massMap.get(key) * this.mass;
  }

}
