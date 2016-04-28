/**
 * Provides mutation operations for genotypes.
 *
 * @module algorithm/mutation/mutator
 */

import {
          calcSectorAngle,
          calculatePolygonBounds,
          calculateXStep,
          generateHipJointPosition,
          generateRandomPolygonPoint
        }
from '../individual/body';
import EngineMutationRule from './rules/engine';
import Individual from '../individual/individual';
import inside from 'point-in-polygon';
import Leg from '../individual/leg';
import { List } from 'immutable';
import Population from '../population/population';
import random from '../../util/random';

// Probabilities
const PROBABILITY_BODY_POINT = 0.1;
const PROBABILITY_HIP_JOINT = 0.1;
const PROBABILITY_LEG_HEIGHT = 0.1;
const PROBABILITY_LEG_HEIGHT_FACTOR = 0.1;


// Mutation steps
const MUTATION_STEP_LEG_HEIGHT = 0.05;
const MUTATION_STEP_LEG_HEIGHT_FACTOR = 0.05;

const ruleEngine = new EngineMutationRule({
  probability: 0.1,
  engine: {
    add: 0.01,
    del: 0.01,
    movement: 0.1
  },
  lens: {
    index: 0.01,
    side: 0.01,
    type: 0.01
  },
  movement: {
    id: 0.01,
    lens: 0.01,
    parameters: 0.1
  }
});

/**
 * Represents a mutator for genotypes.
 */
export default class Mutator {

  /**
   * Mutates a given population
   *
   * @param  {Population} population to be mutated
   * @return {Population}            mutated population
   */
  mutate(population) {
    const copied = population.individuals.map((toCopy) => new Individual(toCopy));
    const offsprings = copied.map((individual) => {

      const bodyPoints = this.tryMutateBodyPoints(individual.body.bodyPoints, individual.body.bodyPointsCount);
      individual.body.bodyPoints = bodyPoints;


      const hipJointPositions = this.tryMutateHipJoints(bodyPoints, individual.body.hipJointPositions);
      individual.body.hipJointPositions = hipJointPositions;

      const legs = this.tryMutateLegs(individual.legs);
      individual.legs = legs;

      individual = ruleEngine.tryMutate(individual);

      const offspring = new Individual(individual);
      // offspring.body.massFactor
      return offspring;
    });
    return new Population(offsprings, population.generationCount + 1);
  }

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

  tryMutateHipJoints(bodyPoints, oldHipJointPositions) {
    const polygon = List(bodyPoints);
    const { minX, minY, maxX, maxY } = calculatePolygonBounds(polygon);
    const hipJointPositions = oldHipJointPositions.map((hipJointPosition, index) => {
      if (this.shouldMutate(PROBABILITY_HIP_JOINT)) {
        return this.mutateHipJoint(minX, maxX, minY, maxY, bodyPoints, index);
      }
      if (!inside(hipJointPosition, bodyPoints)) {
        return this.mutateHipJoint(minX, maxX, minY, maxY, bodyPoints, index);
      }
      return hipJointPosition;
    });
    return hipJointPositions;
  }

  tryMutateLegs(oldLegs) {
    const oldLegList = List.of(oldLegs['0'], oldLegs['1'], oldLegs['2'], oldLegs['3'], oldLegs['4'], oldLegs['5']);
    const legs = oldLegList.map((legDescriptor) => {
      const leg = legDescriptor.leg;
      const legHeight = this.ifElse(this.shouldMutate(PROBABILITY_LEG_HEIGHT),
        this.mutateRealValue(leg.height, MUTATION_STEP_LEG_HEIGHT), leg.height);
      const legHeightFactor = this.ifElse(this.shouldMutate(PROBABILITY_LEG_HEIGHT_FACTOR),
        this.mutateRealValue(leg.heightFactor, MUTATION_STEP_LEG_HEIGHT_FACTOR), leg.heightFactor);
      return {
        leg: new Leg(
          {
            mass: leg.mass,
            massFactor: leg.massFactor,
            height: legHeight,
            heightFactor: legHeightFactor
          }
        ),
        joint: legDescriptor.hipJoint
      };
    });
    return { 0: legs.get(0), 1: legs.get(1), 2: legs.get(2), 3: legs.get(3), 4: legs.get(4), 5: legs.get(5) };
  }

  mutateRealValue(realValue, mutationStep) {
    const step = random.real(-mutationStep, mutationStep);
    return realValue + step;
  }

  mutateHipJoint(minX, maxX , minY , maxY, bodyPoints, index) {
    const xStep = calculateXStep(minX, maxX);
    const localMinX = minX + (index * xStep);
    const localMaxX = minX + ((index + 1) * xStep);
    return generateHipJointPosition(localMinX, localMaxX, minY, maxY, bodyPoints);
  }

  shouldMutate(probability) {
    const discreteNumber = probability * 100;
    const randomNumber = random.integer(1, 100);
    return randomNumber <= discreteNumber;
  }

  ifElse(bool, valueA, valueB) {
    if (bool) {
      return valueA;
    }
    return valueB;
  }

}
