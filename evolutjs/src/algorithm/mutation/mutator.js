/**
 * Provides mutation operations for genotypes.
 *
 * @module algorithm/mutation/mutator
 */

import BodyMutationRule from './rules/body';
import config from '../../app/config';
import EngineMutationRule from './rules/engine';
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
 * @param {Genotype} genotype A genotype of an individual
 * @return {Object} An instatitated Individual
 */
function fastApplyMutationRules(genotype) {
  return ruleEngine.mutate(ruleLeg.mutate(ruleBody.mutate(genotype)));
}

/**
 * Returns a mutated individual.
 *
 * @function
 * @param {Genotype} genotype A genotype of an individual
 * @return {Object} An instatitated Individual
 */
export const mutateGenotype = fastApplyMutationRules;
