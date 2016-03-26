/**
 * Lenses for accessing constraints.
 *
 * @module engine/constraintLenses
 */

import L from 'partial.lenses';
import { lens } from 'ramda';

export const immLens = key => lens(x => x.get(key), (val, x) => x.set(key, val));

export const lensJointsMap = L.prop('jointsMap');

export const lensFront = immLens('front');
export const lensMiddle = immLens('middle');
export const lensBack = immLens('back');

export const lensHip = L.prop('hip');

export const lensLeftJoints = L.compose(lensJointsMap, immLens('left'));
export const lensLeftFrontJoint = L.compose(lensLeftJoints, lensFront);
export const lensLeftMiddleJoint = L.compose(lensLeftJoints, lensMiddle);
export const lensLeftBackJoint = L.compose(lensLeftJoints, lensBack);

export const lensRightJoints = L.compose(lensJointsMap, immLens('right'));
export const lensRightFrontJoint = L.compose(lensRightJoints, lensFront);
export const lensRightMiddleJoint = L.compose(lensRightJoints, lensMiddle);
export const lensRightBackJoint = L.compose(lensRightJoints, lensBack);
