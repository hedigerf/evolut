/**
 * Lenses for accessing constraints.
 *
 * @module engine/constraintLenses
 */

import L from 'partial.lenses';
import { lens } from 'ramda';

import { freeze } from '../util/object';

/**
 * Lens for immutable-js data types.
 *
 * @function
 * @param {String} key
 * @return {Lens}
 */
export const immutableLens = key => lens(x => x.get(key), (val, x) => x.set(key, val));

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
export const lensLeftFrontJoint = L.compose(lensLeftJoints, lensFront);

/**
 * Lens left middle revolute constraint information.
 *
 * @function
 * @return {Lens}
 */
export const lensLeftMiddleJoint = L.compose(lensLeftJoints, lensMiddle);

/**
 * Lens left back revolute constraint information.
 *
 * @function
 * @return {Lens}
 */
export const lensLeftBackJoint = L.compose(lensLeftJoints, lensBack);

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
export const lensRightFrontJoint = L.compose(lensRightJoints, lensFront);

/**
 * Lens right middle revolute constraint information.
 *
 * @function
 * @return {Lens}
 */
export const lensRightMiddleJoint = L.compose(lensRightJoints, lensMiddle);

/**
 * Lens right back revolute constraint information.
 *
 * @function
 * @return {Lens}
 */
export const lensRightBackJoint = L.compose(lensRightJoints, lensBack);

//

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
const LensIdMap = freeze({
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
});

/**
 * Returns the lens specified by id.
 *
 * @param {String} lensId
 * @return {Lens}
 */
export function getLensById(lensId) {
  return LensIdMap[lensId];
}
