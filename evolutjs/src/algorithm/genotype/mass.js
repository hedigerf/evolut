/**
 * Mass distribution module.
 *
 * @module algorithm/genotype/mass
 */

import { assoc, curry, head, last, mapObjIndexed, multiply, prop } from 'ramda';

import { partition, reduce } from '../../util/object';

/**
 * Default mass of an individual's body.
 *
 * @type {Number}
 */
const DEFAULT_BODY_MASS = 1;


const getFactor = prop('massFactor');
const getMass = curry(
  (mass, part) => multiply(mass, getFactor(part))
);
const setMass = curry(
  (mass, part) => assoc('mass', getMass(mass, part), part)
);

/**
 * Distribute a mass by the nested part object.
 * Each level is searched for the property massFactor.
 *
 * @param {Object} parts Parts object of a genotype.
 * @param {Number} [mass=DEFAULT_BODY_MASS]
 * @return {Object}
 * @throws {Error}
 */
export default function distribute(parts, mass = DEFAULT_BODY_MASS) {

  // Const masses = mapObjIndexed(setMass(mass), parts);

  const partitioned = partition(getFactor, parts);
  const partsWithMass = mapObjIndexed(setMass(mass), head(partitioned));
  const remainingMass = mass - reduce((acc, part) => acc + prop('mass', part), 0, partsWithMass);

  const o = distribute(last(partitioned), remainingMass);
  console.log(JSON.stringify(o));

  return parts;
}
