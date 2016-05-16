/**
 * Provides a generator for an population.
 *
 * @module algorithm/population/InitialPopulationGenerator
 */

import { debug, error, info } from '../../util/logUtil';
import { List, Range } from 'immutable';
import Individual from '../individual/individual';
import log4js from 'log4js';
import Population from './population';

const logger = log4js.getLogger('InitialPopulationGenerator');

/**
 * The initial seed of an individual.
 * Overrides random generated values while seeding.
 *
 * @type {Object}
 * @property {Object} body
 * @property {Object} engine
 * @property {Array<Object>} legs The leg pairs
 * @property {Object} legs.joint The hip joint
 * @property {Object} legs.leg The leg
 * @property {Object} legs.leg.joint The knee joint
 */
const initialSeed = {
  body: { },
  engine: { },
  legs:
  [
    {
      leg: { },
      joint: { orientation: 1 }
    },
    {
      leg: { },
      joint: { orientation: 1 }
    },
    {
      leg: { },
      joint: { orientation: 1 }
    },
    {
      leg: { joint: { orientation: 1 } }
    },
    {
      leg: { joint: { orientation: 1 } }
    },
    {
      leg: { joint: { orientation: 1 } }
    }
  ]
};

/**
 * Responsible for generation the initial Population of the Simulation
 */
export default class InitialPopulationGenerator {

  /**
   * Constructs an initial population generator.
   *
   * @param {Range} bodyPointsRange
   * @param {Number} populationSize
   */
  constructor(bodyPointsRange, populationSize) {

    /**
     * The range where the count of body points must be within.
     *
     * @type {Range}
     */
    this.bodyPointsRange = bodyPointsRange;

    /**
     * The population size.
     *
     * @type {Number}
     */
    this.populationSize = populationSize;
  }

  /**
   * Validates the amount of individuals per body point.
   *
   * @private
   * @param {Number} individualPerBodyPoint
   */
  validateIndividualCountPerBodyPoint(individualPerBodyPoint) {
    if (!Number.isInteger(individualPerBodyPoint)) {

      const message = 'PopulationSize: ' + this.populationSize + ' divided through BodyPointsRange.size: ' +
        this.bodyPointsRange.size + ' must be a discrete number and not: ' + individualPerBodyPoint;

      error(logger, message);
      throw new Error(message);
    }
  }

  /**
   * Generatse an initial population.
   *
   * @return {Population} the initial population
   */
  generateInitialPopulation() {

    const individualsPerBp = this.populationSize / this.bodyPointsRange.size;

    this.validateIndividualCountPerBodyPoint(individualsPerBp);

    let currentBodyPointsIndex = 0;
    info(logger, 'Genearting initial population with ' + this.bodyPointsRange.size +
      ' different BodyPoints. ' + individualsPerBp + ' Individuals per BodyPoint variation.');

    const individuals = Range(1, this.populationSize + 1).map((count) => {

      const seed = Individual.seed(initialSeed);

      // Check if new body point count should be applied
      if (count % individualsPerBp === 0 && this.populationSize !== count) {
        currentBodyPointsIndex = count / individualsPerBp;
        debug(logger, 'Switched to ' + this.bodyPointsRange.get(currentBodyPointsIndex) + ' BodyPoints');
      }

      return new Individual(seed);
    });

    return new Population(new List(individuals), 1);
  }

}
