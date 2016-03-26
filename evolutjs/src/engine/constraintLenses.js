/**
 * Lenses for accessing constraints.
 *
 * @module engine/constraintLenses
 */

import L from 'partial.lenses';
import { lens } from 'ramda';

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
export const lensKnee = L.prop('Knee');

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
