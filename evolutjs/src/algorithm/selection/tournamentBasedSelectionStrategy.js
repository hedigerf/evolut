import log4js from 'log4js';
import Immutable from 'immutable';
import SelectionStrategy from './selectionStrategy';
import Random from 'random-js';


const logger = log4js.getLogger('TournamentBasedSelectionStrategy');
const random = new Random(Random.engines.mt19937().autoSeed());

/**
 * TournamentBasedSelectionStrategy
 */
export default class TournamentBasedSelectionStrategy extends SelectionStrategy {
  constructor(population, k) {
    super(population);
    this.k = k;
    logger.info('Torunament-based Selection k = ' + k);
  }

  /**
   * Selects the new generation
   *
   * @return {ImmutableList} A list containings the new individuals
   */
  select() {
    const runs = this.population.size;

    const selectForRun = (runNr) => {

      const chooseIndividuals = (kCount) => {
        const randomIndex = random.integer(0, this.population.size -
          1);
        logger.debug('kCount: ' + kCount + ' randomIndex: ' + randomIndex);
        return this.population.individuals[randomIndex];
      };

      logger.debug('RunNr: ' + runNr);
      const selectedIndividuals = Immutable.Range(1, this.k).map(
        chooseIndividuals);
      const fittestIndividual = selectedIndividuals.max((individualA,
        individualB) => individualA.fitness > individualB.fitness);
      return fittestIndividual;
    };

    return Immutable.Range(1, runs).map(selectForRun);

  }

}
