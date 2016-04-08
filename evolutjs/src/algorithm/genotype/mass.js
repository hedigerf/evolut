/**
 * Mass distribution module.
 *
 * @module algorithm/genotype/mass
 */

import { compose, curry, equals, keys, not } from 'ramda';
import { reduce } from '../../util/object';

/**
 * Default mass of an individual's body.
 *
 * @type {Number}
 */
const DEFAULT_BODY_MASS = 1;

/**
 * Calculates the mass for a single part object.
 *
 * @function
 * @param {Number} mass The total mass to be distributed.
 * @param {Number} sumFactors The sum of all factors.
 * @param {Number} factor  The current factor.
 * @return {Number} The mass for this part object.
 */
const calcMass = curry(
  (mass, sumFactors, factor) => mass * factor / sumFactors
);

/**
 * Tests a property name if it's not equal 'mass'.
 *
 * @function
 * @param {String} propertyName The name of a property.
 * @return {Boolean}
 */
const isNotMass = compose(not, equals('mass'));

/**
 * Accumulates all encountered mass factors.
 *
 * @param {Number} sum The mass factor accumulator.
 * @param {*} value The value of a property.
 * @param {String} key The key of a property.
 * @return {Number} The sum of the mass factors.
 */
function accumulateMassFactor(sum, value, key) {
  if (key === 'massFactor') {
    return sum + value;
  } else if (typeof value === 'object' && value !== null) {
    return reduce(accumulateMassFactor, sum, value);
  }
  return sum;
}

/**
 * Sums up all mass factors of a nested part object.
 *
 * @param {Object} obj The part object.
 * @return {Number} The sum of all mass factors.
 */
function sumMassFactor(obj) {
  return reduce(accumulateMassFactor, 0, obj);
}

/**
 * Sets for a nested part object all mass properties.
 *
 * @param {Object} obj The part object.
 * @param {function(Number): Number} calcMass Calculates the mass.
 */
function setMassFactor(obj, calcMass) {

  keys(obj).filter(isNotMass).forEach((name) => {
    const prop = obj[name];
    if (name === 'massFactor') {
      obj.mass = calcMass(prop || 0);
    } else if (typeof prop === 'object' && prop !== null) {
      setMassFactor(prop, calcMass);
    }
  });
}

/**
 * Distribute a mass by the nested part object.
 * Each level is searched for the property massFactor.
 *
 * @param {Object} parts Parts object of a genotype.
 * @param {Number} [mass=DEFAULT_BODY_MASS]
 * @return {Object}
 */
export default function distribute(parts, mass = DEFAULT_BODY_MASS) {

  const sumFactors = sumMassFactor(parts);
  const calc = calcMass(mass, sumFactors);

  setMassFactor(parts, calc);

  return parts;
}
