'use strict';

import { always, assoc, curry, either, mapObjIndexed, multiply, prop } from 'ramda';

/**
 * Default mass of an individual's body.
 *
 * @type {Number}
 */
const DEFAULT_BODY_MASS = 1;


const getFactor = either(prop('massFactor'), always(0));
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
 * @throws {Error}
 */
export default function distribute(parts, mass = DEFAULT_BODY_MASS) {

  const masses = mapObjIndexed(setMass(mass), parts);

  return parts;
}
