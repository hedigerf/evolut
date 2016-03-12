import Population from './population';

/**
 * Responsible for generation the initial Population of the Simulation
 */
export default class InitialPopulationGenerator{
  constructor(bodyPointsRange,populationSize) {
    this.bodyPointsRange = bodyPointsRange;
    this.populationSize = populationSize;
  }

  generateInitialPopulation() {
    return new Population(undefined,1);
  }
}
