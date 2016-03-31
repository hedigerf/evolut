import {List, Range} from 'immutable';
import log4js from 'log4js';

import Population from './population';
import Individual from '../individual/individual';
import {debug, info, error} from '../../util/logUtil';

const logger = log4js.getLogger('InitialPopulationGenerator');

/**
 * Responsible for generation the initial Population of the Simulation
 */
export default class InitialPopulationGenerator {
  constructor(bodyPointsRange, populationSize) {
    this.bodyPointsRange = bodyPointsRange;
    this.populationSize = populationSize;
  }
  /**
   * Generate an initial population
   *
   * @return {Population} the initial population
   */
  generateInitialPopulation() {
    const individualsPerBp = this.populationSize / this.bodyPointsRange.size;
    if (!Number.isInteger(individualsPerBp)) {
      const message = 'PopulationSize: ' + this.populationSize + ' divided through BodyPointsRange.size: ' +
        this.bodyPointsRange.size + ' must be a discrete number and not: ' + individualsPerBp;
      error(logger, message);
      throw new Error(message);
    }
    let currentBodyPointsIndex = 0;
    info(logger, 'Genearting initial population with ' + this.bodyPointsRange.size +
      ' different BodyPoints. ' + individualsPerBp + ' Individuals per BodyPoint variation.');
    const individuals = Range(1, this.populationSize + 1).map(count => {
      const currentBodyPoints = this.bodyPointsRange.get(currentBodyPointsIndex);

      const seed = Individual.seed({
        body: { massFactor: 1, bodyPointsCount: currentBodyPoints, bodyPoints: [[0, 0], [1, 0], [1, 1], [0, 1]],
          hipJointPositions: [[(0.5 * (1 - 1)), 0], [(0.5 * (2 - 1)), 0], [(0.5 * (3 - 1)), 0]] },
        engine: { movement: [] },
        legs:
        [
          {
            leg: { height: 0.8, heightFactor: 0.5, massFactor: 1 },
            joint: { orientation: 1 }
          },
          {
            leg: { height: 0.8, heightFactor: 0.5, massFactor: 1 },
            joint: { orientation: 1 }
          },
          {
            leg: { height: 0.8, heightFactor: 0.5, massFactor: 1 },
            joint: { orientation: 1 }
          },
          {
            leg: { height: 0.8, heightFactor: 0.5, massFactor: 1, joint: { orientation: 1 } }
          },
          {
            leg: { height: 0.8, heightFactor: 0.5, massFactor: 1, joint: { orientation: 1 } }
          },
          {
            leg: { height: 0.8, heightFactor: 0.5, massFactor: 1, joint: { orientation: 1 } }
          }
        ]
      });

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
