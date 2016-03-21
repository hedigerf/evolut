import {List, Range} from 'immutable';
import log4js from 'log4js';

import Population from './population';
import Individual from '../individual/individual';
import {debug, info, error} from '../../util/logUtil';

const logger = log4js.getLogger('InitialPopulationGenerator');

/**
 * Responsible for generation the initial Population of the Simulation
 */
export default class InitialPopulationGenerator{
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
        body: { massFactor: 0.6, bodyPoints: currentBodyPoints },
        engine: { type: 'test' },
        legs: [
          { leg: { massFactor: 666, joint: { orientation: 3333333333 } } }
        ]
      });

      console.log(JSON.stringify(seed));
      // Check if new body point count should be applied
      if (count % individualsPerBp === 0 && this.populationSize !== count) {
        currentBodyPointsIndex = count / individualsPerBp;
        debug(logger, 'Switched to ' + this.bodyPointsRange.get(currentBodyPointsIndex) + ' BodyPoints');
      }
      const i = new Individual(seed);
      debug(logger, i.blueprint());
      return i;
    });
    return new Population(new List(individuals), 1);
  }
}
