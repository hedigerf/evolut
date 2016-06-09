/**
 * Provides a diversity report.
 *
 * @module report/diversityCalculator
 */

import * as L from 'partial.lenses';
import { add, divide, norm, square, subtract } from 'mathjs';
import { lensBody, lensNthLeg } from  '../algorithm/genotype/lenses';
import {lensMass as lensBodyMass, lensBodyPoints,
  lensBodyPointsCount, lensHipJointPositions } from  '../algorithm/individual/body';
import {lensHeight, lensHeightFactor, lensMass, lensWidth}  from  '../algorithm/individual/leg';
import { List, Range } from 'immutable';
import { calcPolygonArea } from  '../algorithm/genotype/mass';
import { isCompoundMovement } from '../engine/movement';
import { view } from 'ramda';

const lensBodyBodyPoints = L.compose(lensBody, lensBodyPoints);
const lensBodyBodyPointsCount = L.compose(lensBody, lensBodyPointsCount);
const lensBodyBodyMass = L.compose(lensBody, lensBodyMass);

const lensBodyHipJointPositions = L.compose(lensBody, lensHipJointPositions);
const lensBodyHipJointPositionsNth = (n) => L.compose(lensBodyHipJointPositions, L.prop(n));

const lensNthLegHeight = (n) => L.compose(lensNthLeg(n), lensHeight);
const lensNthLegHeightFactor = (n) => L.compose(lensNthLeg(n), lensHeightFactor);
const lensNthLegMass = (n) => L.compose(lensNthLeg(n), lensMass);
const lensNthLegWidth = (n) => L.compose(lensNthLeg(n), lensWidth);

export default class DiversityCalculator {

  /**
   * Calculates the streuung
   * @param  {[Population]} population the population
   * @return {[Number]}            the streuung
   */
  static calculate(population) {
    const sumUp = (vectorSum, diversityVector) => add(vectorSum, diversityVector);
    const individuals = List(population.individuals);
    const diversityVectors = individuals.map((individual) => this.createDiversityVector(individual));
    const zeroVector = List(Range(0, diversityVectors.get(0).length)).map(() => 0).toArray();
    const sum = diversityVectors.reduce(sumUp, zeroVector);
    const balanceVector = divide(sum, diversityVectors.size);
    const subDiversityVectors = diversityVectors.map((diversityVector) => subtract(diversityVector, balanceVector));
    const normSquaredDiversityVectors = subDiversityVectors.map((diversityVector) => square(norm(diversityVector)));
    const punktStreuung = normSquaredDiversityVectors.reduce(sumUp, 0.0) / diversityVectors.size;
    return punktStreuung;
  }
  /**
   * tail-recurisve function which counts all different types of movements.
   * @param  {List} movements [description]
   * @param  {Object} count     [accumulator of count]
   * @return {Object}           [count]
   */
  static countMovements(movements, count) {
    const newCount = List(movements).reduce(({countMovement, countCompound}, movement) => {
      if (isCompoundMovement(movement)) {
        return this.countMovements(List(movement.params), {countMovement, countCompound: countCompound + 1});
      }
      return {countMovement: countMovement + 1, countCompound};

    }, count);
    return newCount;
  }
  /**
   * Creates one diversity vector
   * @param  {Genotype} individual [genotype of the individual]
   * @return {Object}            [the diversity vector]
   */
  static createDiversityVector(individual) {
    // only use 0,2,4 because legs are symetrical
    const normLegPairDistance0 = norm(view(lensBodyHipJointPositionsNth(0), individual));
    const normLegPairDistance1 = norm(view(lensBodyHipJointPositionsNth(1), individual));
    const normLegPairDistance2 = norm(view(lensBodyHipJointPositionsNth(2), individual));
    const legHeight0 = view(lensNthLegHeight(0), individual);
    const legHeightFactor0 = view(lensNthLegHeightFactor(0), individual);
    const legWidth0 = view(lensNthLegWidth(0), individual);
    const legMass0 = view(lensNthLegMass(0), individual);
    const legHeight2 = view(lensNthLegHeight(2), individual);
    const legHeightFactor2 = view(lensNthLegHeightFactor(2), individual);
    const legWidth2 = view(lensNthLegWidth(2), individual);
    const legMass2 = view(lensNthLegMass(2), individual);
    const legHeight4 = view(lensNthLegHeight(4), individual);
    const legHeightFactor4 = view(lensNthLegHeightFactor(4), individual);
    const legWidth4 = view(lensNthLegWidth(4), individual);
    const legMass4 = view(lensNthLegMass(4), individual);

    const countOptions = { countMovement: 0, countCompound: 0 };
    const { countMovement, countCompound } = this.countMovements(individual.movements, countOptions);
    const objectVector = {
      bodyPointsArea: calcPolygonArea(view(lensBodyBodyPoints, individual)), // area of polygon
      bodyPointsCount: view(lensBodyBodyPointsCount, individual),
      bodyMass: view(lensBodyBodyMass, individual),
      legDistance1: normLegPairDistance0, // length of array (interpreted as vector)
      legHeight1: legHeight0,
      legHeightFactor1: legHeightFactor0,
      legWidth1: legWidth0,
      legMass1: legMass0,
      legDistance2: normLegPairDistance0,
      legHeight2: legHeight0,
      legHeightFactor2: legHeightFactor0,
      legWidth2: legWidth0,
      legMass2: legMass0,
      legDistance3: normLegPairDistance1,
      legHeight3: legHeight2,
      legHeightFactor3: legHeightFactor2,
      legWidth3: legWidth2,
      legMass3: legMass2,
      legDistance4: normLegPairDistance1,
      legHeight4: legHeight2,
      legHeightFactor4: legHeightFactor2,
      legWidth4: legWidth2,
      legMass4: legMass2,
      legDistance5: normLegPairDistance2,
      legHeight5: legHeight4,
      legHeightFactor5: legHeightFactor4,
      legWidth5: legWidth4,
      legMass5: legMass4,
      legDistance6: normLegPairDistance2,
      legHeight6: legHeight4,
      legHeightFactor6: legHeightFactor4,
      legWidth6: legWidth4,
      legMass6: legMass4,
      countMovement: countMovement,
      countCompoundMovement: countCompound
    };
    const arrayVector =  Object.keys(objectVector).map((key) => objectVector[key]);
    return arrayVector;
  }

}
