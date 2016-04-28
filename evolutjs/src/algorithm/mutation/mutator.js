/**
 * Provides mutation operations for genotypes.
 *
 * @module algorithm/mutation/mutator
 */

import BodyMutationRule from './rules/body';
import EngineMutationRule from './rules/engine';
import Individual from '../individual/individual';
import LegMutationRule from './rules/leg';
import Population from '../population/population';

const ruleBody = new BodyMutationRule();
const ruleLeg = new LegMutationRule();
const ruleEngine = new EngineMutationRule({
  add: 0.01,
  del: 0.01,
  lens: {
    index: 0.01,
    side: 0.01,
    type: 0.01
  },
  movement: {
    id: 0.01,
    parameters: 0.1
  }
});

/**
 * Represents a mutator for genotypes.
 */
export default class Mutator {

  /**
   * Mutates a given population.
   *
   * @param  {Population} population The population to be mutated
   * @return {Population} The mutated population
   */
  mutate(population) {

    const rules = [ruleBody, ruleLeg, ruleEngine];
    const copied = population.individuals.map((toCopy) => new Individual(toCopy));
    const offsprings = copied.map((individual) => {

      individual = rules.reduce((mutated, rule) => rule.tryMutate(mutated), individual);
      return new Individual(individual);

    });
    return new Population(offsprings, population.generationCount + 1);
  }

}
