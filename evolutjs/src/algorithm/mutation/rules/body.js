/**
 * Provides mutation rules for a body.
 *
 * @module algorithm/mutation/rules/body
 * @see algorithm/mutation/rule
 */

import {
  calcSectorAngle,
  calculatePolygonBounds,
  calculateXStep,
  generateHipJointPosition,
  generateRandomPolygonPoint
} from '../../individual/body';
import inside from 'point-in-polygon';
import { List } from 'immutable';
import MutationRule from '../rule';

const PROBABILITY_BODY_POINT = 0.1;
const PROBABILITY_HIP_JOINT = 0.1;

/**
 * Represents a mutation rule for a body.
 *
 * @extends {MutationRule}
 */
export default class BodyMutationRule extends MutationRule {

  /**
   * Mutates a body.
   *
   * @protected
   * @param {Genotype} genotype
   * @return {Genotype}
   */
  mutate(genotype) {

    const body = genotype.body;

    body.bodyPoints = this.tryMutateBodyPoints(body.bodyPoints, body.bodyPointsCount);
    body.hipJointPositions = this.tryMutateHipJoints(body.bodyPoints, body.hipJointPositions);

    return genotype;
  }

  /**
   * Mutate body polygon.
   *
   * @protected
   * @param {Array<Vector>} oldBodyPoints Current body point vectors
   * @param {Number} bodyPointsCount
   * @return {Array<Vector>}
   */
  tryMutateBodyPoints(oldBodyPoints, bodyPointsCount) {

    const sectorAngle = calcSectorAngle(bodyPointsCount);
    const bodyPoints = oldBodyPoints.map((bodyPoint, index) => {

      if (this.shouldMutate(PROBABILITY_BODY_POINT)) {
        const startAngle = index * sectorAngle;
        const endAngle = startAngle + sectorAngle;
        const randomBodyPoint = generateRandomPolygonPoint(startAngle, endAngle);
        return randomBodyPoint;
      }

      return bodyPoint;
    });

    return bodyPoints;
  }

  /**
   * Mutate hip joint positions.
   *
   * @protected
   * @param {Array<Vector>} bodyPoints Current body point vectors
   * @param {Array<Vector>} oldHipJointPositions
   * @return {Array<Vector>}
   */
  tryMutateHipJoints(bodyPoints, oldHipJointPositions) {

    const polygon = List(bodyPoints);
    const { minX, minY, maxX, maxY } = calculatePolygonBounds(polygon);
    const positions = oldHipJointPositions.map((hipJointPosition, index) => {
      if (this.shouldMutate(PROBABILITY_HIP_JOINT)) {
        return this.mutateHipJoint(minX, maxX, minY, maxY, bodyPoints, index);
      }
      if (!inside(hipJointPosition, bodyPoints)) {
        return this.mutateHipJoint(minX, maxX, minY, maxY, bodyPoints, index);
      }
      return hipJointPosition;
    });

    return positions;
  }

  /**
   * Mutate a hip joint position.
   *
   * @protected
   * @param {Number} minX
   * @param {Number} maxX
   * @param {Number} minY
   * @param {Number} maxY
   * @param {List<Vector>} bodyPoints
   * @param {Number} index
   * @return {Vector}
   */
  mutateHipJoint(minX, maxX , minY , maxY, bodyPoints, index) {
    const xStep = calculateXStep(minX, maxX);
    const localMinX = minX + index * xStep;
    const localMaxX = minX + (index + 1) * xStep;
    return generateHipJointPosition(localMinX, localMaxX, minY, maxY, bodyPoints);
  }

}
