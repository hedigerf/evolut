/**
 * Provides mutation operations for genotypes.
 *
 * @module algorithm/mutation/mutator
 */

import { clone, compose, reduce } from 'ramda';
import BodyMutationRule from './rules/body';
import config from '../../app/config';
import EngineMutationRule from './rules/engine';
import Individual from '../individual/individual';
import LegMutationRule from './rules/leg';

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
 * @type {Array<MutationRule>}
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
 * @return {function(Genotype): Object} A mutation function
 */
function applyMutationRules(rules) {
  return (genotype) => reduce(mutate, genotype, rules);
}

/**
 * Returns a mutated individual.
 *
 * @function
 * @param {Genotype} genotype A genotype of an individual
 * @return {Genotype} An instatitated Individual
 */
export const mutateGenotype = compose(instantiate, applyMutationRules(rules), clone);
