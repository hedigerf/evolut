/**
 * Provides mutation operations for genotypes.
 *
 * @module algorithm/mutation/mutator
 */

import { compose, reduce } from 'ramda';
import BodyMutationRule from './rules/body';
import config from '../../app/config';
import EngineMutationRule from './rules/engine';
import Individual from '../individual/individual';
import LegMutationRule from './rules/leg';
import Population from '../population/population';

/**
 * Rule for a body mutation.
 *
 * @type {BodyMutationRule}
 */
const ruleBody = new BodyMutationRule(config('mutation:body'));

/**
 * Rule for a leg mutation.
 *
 * @type {LegMutationRule}
 */
const ruleLeg = new LegMutationRule(config('mutation:leg'));

/**
 * Mutation rule for an individual's engine.
 *
 * @type {EngineMutationRule}
 */
const ruleEngine = new EngineMutationRule(config('mutation:engine'));

/**
 * These rules are applied to a genotype.
 * Each rule returns a mutated version where some part was modified.
 *
 * @type {Array<Mutation>}
 */
const rules = [ruleBody, ruleLeg, ruleEngine];

/**
 * Returns a new instance of an individual.
 *
 * @param {Object} genotype A genotype of an individual
 * @return {Individual} An instatitated Individual
 */
function instantiate(genotype) {
  return new Individual(genotype);
}

/**
 * Returns a mutated genotype.
 *
 * @param {Genotype} genotype
 * @param {MutationRule} rule
 * @return {Genotype}
 */
function mutate(genotype, rule) {
  return rule.mutate(genotype);
}

/**
 * Applies a list of mutation rules to a genotype.
 * Returns a mutated genotype.
 *
 * @param {Array<MutationRule>} rules A list of mutation rules
 * @return {function(genotype: Genotype): Object} A mutation function
 */
function applyMutationRules(rules) {
  return (genotype) => reduce(mutate, genotype, rules);
}

/**
 * Returns a mutated individual.
 *
 * @function
 * @param {Individual} genotype A genotype of an individual
 * @return {Individual} An instatitated Individual
 */
const mutateGenotype = compose(instantiate, applyMutationRules(rules));

/**
 * Represents a mutator which mutates a selected population.
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
