/**
 * Provides lenses for genotypes.
 *
 * @module algorithm/genotype/lenses
 */

import * as L from 'partial.lenses'
import { apply, keys } from 'ramda';

/**
 * Index of first element.
 *
 * @type {Number}
 */
const FIRST = 0;

/**
 * Lens for body information.
 *
 * @return {Lens}
 */
export const lensBody = L.prop('body');

/**
 * Lens for engine information.
 *
 * @return {Lens}
 */
export const lensEngine = L.prop('engine');

/**
 * Lens for joint information.
 *
 * @return {Lens}
 */
export const lensJoint = L.prop('joint');

/**
 * Lens for leg information.
 *
 * @return {Lens}
 */
export const lensLeg = L.prop('leg');

/**
 * Lens for legs information.
 *
 * @return {Lens}
 */
export const lensLegs = L.prop('legs');

/**
 * Lens for nth leg pair information.
 *
 * @param {Number} index
 * @return {Lens}
 */
export const lensNthLegPair = (index) => L.compose(lensLegs, L.index(index));

/**
 * Lens for nth leg information.
 *
 * @param {Number} index
 * @return {Lens}
 */
export const lensNthLeg = (index) => L.compose(lensNthLegPair(index), lensLeg);

/**
 * Lens for nth hip joint information.
 *
 * @param {Number} index
 * @return {Lens}
 */
export const lensNthHipJoint = (index) => L.compose(lensNthLegPair(index), lensJoint);

/**
 * Lens for nth knee joint (nth leg's joint) information.
 *
 * @param {Number} index
 * @return {Lens}
 */
export const lensNthKneeJoint = (index) => L.compose(lensNthLegPair(index), lensLeg, lensJoint);

/**
 * Lens for first leg pair information.
 *
 * @return {Lens}
 */
export const lensFirstLegPair = lensNthLegPair(FIRST);

/**
 * Lens for first leg information.
 *
 * @return {Lens}
 */
export const lensFirstLeg = lensNthLeg(FIRST);

/**
 * Lens for first hip joint information.
 *
 * @return {Lens}
 */
export const lensFirstHipJoint = lensNthHipJoint(FIRST);

/**
 * Lens for first knee joint (first leg's joint) information.
 *
 * @return {Lens}
 */
export const lensFirstKneeJoint = lensNthKneeJoint(FIRST);

/**
 * Chooses the property with the highest index.
 *
 * @param {Object} [legs={}] All leg pairs
 * @return {Lens}
 */
const lensChooseLast = L.choose(
  (legs = {}) => L.index(apply(Math.max, keys(legs)))
);

/**
 * Lens for last leg pair information.
 *
 * @return {Lens}
 */
export const lensLastLegPair = L.compose(lensLegs, lensChooseLast);

/**
 * Lens for last leg information.
 *
 * @return {Lens}
 */
export const lensLastLeg = L.compose(lensLastLegPair, lensLeg);

/**
 * Lens for last hip joint information.
 *
 * @return {Lens}
 */
export const lensLastHipJoint = L.compose(lensLastLegPair, lensJoint);

/**
 * Lens for last knee joint (first leg's joint) information.
 *
 * @return {Lens}
 */
export const lensLastKneeJoint = L.compose(lensLastLegPair, lensLeg, lensJoint);
