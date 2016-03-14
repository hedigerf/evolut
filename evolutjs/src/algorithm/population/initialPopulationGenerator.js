import {Range} from 'immutable';
import log4js from 'log4js';

import Population from './population';
import Individual from '../individual/individual';
import {Genotype} from '../individual/genotype';
import {info,error} from '../../util/logUtil';

const logger = log4js.getLogger('InitialPopulationGenerator');

/**
 * Responsible for generation the initial Population of the Simulation
 */
export default class InitialPopulationGenerator{
  constructor(bodyPointsRange,populationSize) {
    this.bodyPointsRange = bodyPointsRange;
    this.populationSize = populationSize;
  }

  generateInitialPopulation() {
    const individualsPerBp = this.populationSize / this.bodyPointsRange.size;
    if (!Number.isInteger(individualsPerBp)) {
      const message = 'PopulationSize: ' + this.populationSize + ' divided through BodyPointsRange.size: ' +
        this.bodyPointsRange.size + ' must be a discrete number and not: ' + individualsPerBp;
      error(logger,message);
      throw new Error(message);
    }
    let currentBodyPointsIndex = 0;
    info(logger,'Genearting initial population with ' + this.bodyPointsRange.size +
      ' different BodyPoints. ' + individualsPerBp + ' Individuals per BodyPoint variation.');
    const individuals = Range(1,this.populationSize + 1).map(count => {
      const currentBodyPoints = this.bodyPointsRange.get(currentBodyPointsIndex);
      const seed = Genotype.seed(currentBodyPoints);
      // Check if new body point count should be applied
      if (count % individualsPerBp === 0) {
        currentBodyPointsIndex = count / individualsPerBp;
        info(logger,'Switched to ' + this.bodyPointsRange.get(currentBodyPointsIndex) + ' BodyPoints');

      }
      return new Individual(seed);
    });
    return new Population(individuals.cacheResult(),1);
  }
}
