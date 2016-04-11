/**
 * Lenses for accessing constraints.
 *
 * @module engine/constraintLenses
 */

import * as L from 'partial.lenses';
import { lens } from 'ramda';

/**
 * @typedef {{
 *   side: String,
 *   type: String,
 *   index: Number
 * }} LensDescriptor
 */

/**
 * Lens for immutable-js data types.
 *
 * @function
 * @param {String} key
 * @return {Lens}
 */
export const immutableLens = (key) => lens((x) => x.get(key), (val, x) => x.set(key, val));

/**
 * Lens for revolute constraint information of a phenotype.
 *
 * @function
 * @return {Lens}
 */
export const lensJointsMap = L.prop('jointsMap');

/**
 * Lens for front revolute constraint information.
 *
 * @function
 * @return {Lens}
 */
export const lensFront = immutableLens('front');

/**
 * Lens for middle revolute constraint information.
 *
 * @function
 * @return {Lens}
 */
export const lensMiddle = immutableLens('middle');

/**
 * Lens for back revolute constraint information.
 *
 * @function
 * @return {Lens}
 */
export const lensBack = immutableLens('back');

/**
 * Lens for hip revolute constraint information.
 *
 * @function
 * @return {Lens}
 */
export const lensHip = L.prop('hip');

/**
 * Lens for knee revolute constraint information.
 *
 * @function
 * @return {Lens}
 */
export const lensKnee = L.prop('knee');

/**
 * Lens left revolute constraints information.
 *
 * @function
 * @return {Lens}
 */
export const lensLeftJoints = L.compose(lensJointsMap, immutableLens('left'));

/**
 * Lens left front revolute constraint information.
 *
 * @function
 * @return {Lens}
 */
export const lensLeftFrontJoint = L.compose(lensLeftJoints, immutableLens(0));

/**
 * Lens left middle revolute constraint information.
 *
 * @function
 * @return {Lens}
 */
export const lensLeftMiddleJoint = L.compose(lensLeftJoints, immutableLens(1));

/**
 * Lens left back revolute constraint information.
 *
 * @function
 * @return {Lens}
 */
export const lensLeftBackJoint = L.compose(lensLeftJoints, immutableLens(2));

/**
 * Lens right revolute constraints information.
 *
 * @function
 * @return {Lens}
 */
export const lensRightJoints = L.compose(lensJointsMap, immutableLens('right'));

/**
 * Lens right front revolute constraint information.
 *
 * @function
 * @return {Lens}
 */
export const lensRightFrontJoint = L.compose(lensRightJoints, immutableLens(0));

/**
 * Lens right middle revolute constraint information.
 *
 * @function
 * @return {Lens}
 */
export const lensRightMiddleJoint = L.compose(lensRightJoints, immutableLens(1));

/**
 * Lens right back revolute constraint information.
 *
 * @function
 * @return {Lens}
 */
export const lensRightBackJoint = L.compose(lensRightJoints, immutableLens(2));

export const lensLFHip = L.compose(lensLeftFrontJoint, lensHip);
export const lensLMHip = L.compose(lensLeftMiddleJoint, lensHip);
export const lensLBHip = L.compose(lensLeftBackJoint, lensHip);

export const lensLFKnee = L.compose(lensLeftFrontJoint, lensKnee);
export const lensLMKnee = L.compose(lensLeftMiddleJoint, lensKnee);
export const lensLBKnee = L.compose(lensLeftBackJoint, lensKnee);

export const lensRFHip = L.compose(lensRightFrontJoint, lensHip);
export const lensRMHip = L.compose(lensRightMiddleJoint, lensHip);
export const lensRBHip = L.compose(lensRightBackJoint, lensHip);

export const lensRFKnee = L.compose(lensRightFrontJoint, lensKnee);
export const lensRMKnee = L.compose(lensRightMiddleJoint, lensKnee);
export const lensRBKnee = L.compose(lensRightBackJoint, lensKnee);

/**
 * Lens map.
 *
 * @type {Object<Lens>}
 */
const LensIdMap = {
  lfh: lensLFHip,
  lmh: lensLMHip,
  lbh: lensLBHip,
  lfk: lensLFKnee,
  lmk: lensLMKnee,
  lbk: lensLBKnee,
  rfh: lensRFHip,
  rmh: lensRMHip,
  rbh: lensRBHip,
  rfk: lensRFKnee,
  rmk: lensRMKnee,
  rbk: lensRBKnee
};

/**
 * Returns the lens specified by id.
 *
 * @param {String} lensId
 * @return {Lens}
 */
export function getLensById(lensId) {
  return LensIdMap[lensId];
}

/**
 * Create a lens desriptor object.
 *
 * @param {String} side The side, left or right
 * @param {String} type The type, hip or joint
 * @param {Number} index The leg index
 * @return {LensDescriptor} The lens descriptor
 */
export function makeLensDescriptor(side, type, index = 0) {
  return { side, type, index };
}

/**
 * Resolve a lens descriptor and return the lens.
 *
 * @param {LensDescriptor} descriptor
 * @return {Lens} The lens
 */
export function resolveLensDecriptor({ side, type, index }) {

  let lensSide;
  let lensType;

  if (side === 'left') {
    lensSide = immutableLens('left');
  } else if (side === 'right') {
    lensSide = immutableLens('right');
  }

  if (type === 'hip') {
    lensType = lensHip;
  } else if (type === 'knee') {
    lensType = lensKnee;
  }

  return L.compose(lensSide, L.index(index), lensType);
}
