import log4js from 'log4js';
import Immutable from 'immutable';
import SelectionStrategy from './selectionStrategy';
import Random from 'random-js';


const logger = log4js.getLogger('TournamentBasedSelectionStrategy');
const random = new Random(Random.engines.mt19937().autoSeed());

/**
 * TournamentBasedSelectionStrategy
 */
export class TournamentBasedSelectionStrategy extends SelectionStrategy {
  constructor(population, k) {
    super(population);
    this.k = k;
    logger.info('Torunament-based Selection k = ' + k);
  }
/**
 * Select next generation
 * @return {ImmutableList} [A list containing the new Individuals]
 */
  select() {
    const runs = this.initalPopulation.size;

    const selectForRun = (runNr) => {

      const chooseIndividuals = (kCount) => {
        const randomIndex = random.integer(0, this.initalPopulation.size -
          1);
        logger.debug('kCount: ' + kCount + ' randomIndex: ' + randomIndex);
        return this.initalPopulation.individuals[randomIndex];
      };

      logger.debug('RunNr: ' + runNr);
      const selectedIndividuals = Immutable.Range(1, this.k).map(
        chooseIndividuals);
      const fittestIndividual = selectedIndividuals.max((individualA,
        individualB) => individualA.fitness > individualB.fitness);
      return fittestIndividual;
    };

    Immutable.Range(1, runs).map(selectForRun);

  }

}
