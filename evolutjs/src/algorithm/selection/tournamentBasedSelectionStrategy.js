/**
 * Provides a tournament based selection strategy.
 *
 * @module algorithm/selection/tournamentBasedSelectionStrategy
 */

import Immutable from 'immutable';
import { info } from '../../util/logUtil';
import log4js from 'log4js';
import Population from '../population/population';
import random from '../../util/random';
import SelectionStrategy from './selectionStrategy';

const logger = log4js.getLogger('TournamentBasedSelectionStrategy');

/**
 * Sort individuals by fitness.
 *
 * @function
 * @param {Individual} a
 * @param {Individual} b
 * @return {Boolean}
 */
const sortByFitness = (a, b) => a.fitness > b.fitness;

/**
 * Choose random individuals from a population.
 *
 * @function
 * @param {Population} population
 * @return {function(): Individual}
 */
const chooseIndividuals = (population) => () => {

  const randomIndex = random.integer(0, population.individuals.size - 1);
  const chosenOne = population.individuals.get(randomIndex);

  if (chosenOne === undefined) {
    info(logger, 'undefined at ' + randomIndex);
  }

  return chosenOne;
};

/**
 * Represents a tournament-based selection strategy.
 *
 * @extends {SelectionStrategy}
 */
export default class TournamentBasedSelectionStrategy extends SelectionStrategy {

  /**
   * Constructs a tournament-based selection strategy.
   *
   * @param {Number} k The k individuals to choose
   */
  constructor(k) {
    super();
    this.k = k;
    info(logger, 'tournament-based selection k = ' + k);
  }

  /**
   * Selects the new generation
   *
   * @param {Population} population The population to choose from
   * @return {Population} The new population
   */
  select(population) {

    const runs = population.individuals.size;

    const choose = chooseIndividuals(population);
    const selectForRun = () => {

      const selectedIndividuals = Immutable.Range(1, this.k + 1).map(choose);
      const fittestIndividual = selectedIndividuals.max(sortByFitness);

      return fittestIndividual;
    };

    const individuals = Immutable.Range(0, runs).map(selectForRun);

    return new Population(Immutable.List(individuals), population.generationCount);
  }

}
