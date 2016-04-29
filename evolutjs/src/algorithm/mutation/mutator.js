/**
 * Provides mutation operations for genotypes.
 *
 * @module algorithm/mutation/mutator
 */

import BodyMutationRule from './rules/body';
import { compose } from 'ramda';
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

const rules = [ruleBody, ruleLeg, ruleEngine];

/**
 * Returns a new instance of an individual.
 *
 * @function
 * @param {Object} genotype A genotype of an individual
 * @return {Individual} An instatitated Individual
 */
const instantiate = (genotype) => new Individual(genotype);

/**
 * Applies a list of mutation rules to a genotype.
 * Returns a mutated genotype.
 *
 * @function
 * @param {Array<MutationRule>} rules A list of mutation rules
 * @return {function(Individual): Object} A mutation function
 */
const applyMutationRules = (rules) => (genotype) => rules.reduce((mutated, rule) => rule.tryMutate(mutated), genotype);

/**
 * Returns a mutated individual.
 *
 * @function
 * @param {Individual} genotype A genotype of an individual
 * @return {Individual} An instatitated Individual
 */
const mutateGenotype = compose(instantiate, applyMutationRules(rules));

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

    const offsprings = population.individuals.map(mutateGenotype);
    const generationCount = population.generationCount + 1;

    return new Population(offsprings, generationCount);
  }

}
