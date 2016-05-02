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
import { defaultTo } from 'ramda';
import inside from 'point-in-polygon';
import { List } from 'immutable';
import MutationRule from '../rule';

/**
 * Options for body mutation.
 *
 * @typedef {Object} BodyMutationOption
 * @property {Object} bodyPoint
 * @property {Number} bodyPoint.probability
 * @property {Object} hipJoint
 * @property {Number} hipJoint.probability
 */

/**
 * Represents a mutation rule for a body.
 *
 * @extends {MutationRule}
 */
export default class BodyMutationRule extends MutationRule {

  /**
   * Return the option transformation.
   *
   * @return {BodyMutationOption} The transformation
   */
  static get transformation() {
    return {
      bodyPoint: {
        probability: defaultTo(0.1)
      },
      hipJoint: {
        probability: defaultTo(0.1)
      }
    };
  }

  /**
   * Mutates a body.
   *
   * @protected
   * @param {Genotype} genotype
   * @return {Genotype}
   */
  mutate(genotype) {

    const mutated = super.mutate(genotype);
    const body = mutated.body;

    body.bodyPoints = this.tryMutateBodyPoints(body.bodyPoints, body.bodyPointsCount);
    body.hipJointPositions = this.tryMutateHipJoints(body.bodyPoints, body.hipJointPositions);

    return mutated;
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

    const probability = this.options.bodyPoint.probability;
    const sectorAngle = calcSectorAngle(bodyPointsCount);

    return oldBodyPoints.map((bodyPoint, index) => {

      if (this.shouldMutate(probability)) {
        const startAngle = index * sectorAngle;
        const endAngle = startAngle + sectorAngle;
        const randomBodyPoint = generateRandomPolygonPoint(startAngle, endAngle);
        return randomBodyPoint;
      }

      return bodyPoint;
    });
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

    const probability = this.options.hipJoint.probability;
    const polygon = List(bodyPoints);
    const { minX, minY, maxX, maxY } = calculatePolygonBounds(polygon);

    return oldHipJointPositions.map((hipJointPosition, index) => {
      if (this.shouldMutate(probability)) {
        return this.mutateHipJoint(minX, maxX, minY, maxY, bodyPoints, index);
      }
      if (!inside(hipJointPosition, bodyPoints)) {
        return this.mutateHipJoint(minX, maxX, minY, maxY, bodyPoints, index);
      }
      return hipJointPosition;
    });
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
