import log4js from 'log4js';
import Immutable from 'immutable';
import Random from 'random-js';

import SelectionStrategy from './selectionStrategy';
import {debug,info} from '../../util/logUtil';
import Population from '../population/population';

const logger = log4js.getLogger('TournamentBasedSelectionStrategy');
const random = new Random(Random.engines.mt19937().autoSeed());

/**
 * TournamentBasedSelectionStrategy
 */
export default class TournamentBasedSelectionStrategy{
  constructor(population, k) {
    // super(population);
    this.population = population;
    this.k = k;
    info(logger,'Torunament-based Selection k = ' + k);
  }

  /**
   * Selects the new generation
   *
   * @return {Population} the new population
   */
  select() {
    const runs = this.population.individuals.size;

    const selectForRun = (runNr) => {

      const chooseIndividuals = (kCount) => {
        const randomIndex = random.integer(0, this.population.individuals.size - 1);
        debug(logger,'kCount: ' + kCount + ' randomIndex: ' + randomIndex);
        const chosenOne = this.population.individuals.get(randomIndex);
        if (chosenOne === undefined) {
          info(logger,'undefined at ' + randomIndex);
        }
        return chosenOne;
      };

      debug(logger,'RunNr: ' + runNr);
      const selectedIndividuals = Immutable.Range(1, this.k + 1).map(
        chooseIndividuals);
      const fittestIndividual = selectedIndividuals.max((individualA,
        individualB) => individualA.fitness > individualB.fitness);
      return fittestIndividual;
    };

    return new Population(Immutable.Range(0, runs).map(selectForRun),this.population.generationCount + 1);

  }

}
