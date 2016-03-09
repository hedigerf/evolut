import Population from './population';

/**
 * Responsible for generation the initial Population of the Simulation
 */
export default class InitialPopulationGenerator{
  constructor(bodyPointsRange) {
    this.bodyPointsRange = bodyPointsRange;
  }

  generateInitialPopulation() {
    return new Population(undefined);
  }
}
