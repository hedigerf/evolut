/**
 * Provides mutation operations for genotypes.
 *
 * @module algorithm/mutation/mutator
 */

import { clone, compose, curry, reduce } from 'ramda';
import BodyMutationRule from './rules/body';
import config from '../../app/config';
import { distributeWork } from '../../app/app';
import EngineMutationRule from './rules/engine';
import Individual from '../individual/individual';
import { ipcRenderer } from 'electron';
import LegMutationRule from './rules/leg';
import { Worker } from '../../app/ipc';


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
 * @return {function(Genotype): Object} A mutation function
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
const mutateGenotype = compose(instantiate, applyMutationRules(rules), clone);

/**
 * Represents a mutator which mutates a selected population.
 */
export default class Mutator {

  constructor(workers) {
    this.workers = workers;
  }

  /**
   * Mutates a given population.
   *
   * @param  {Population} population The population to be mutated
   */
  mutate(population) {
    const distributor = curry(distributeWork)(Worker.MutationReceive, population, { });
    this.workers.forEach(distributor);

  }

}

/**
 * IPC-Callback for the worker process when it receives work.
 */
ipcRenderer.on(Worker.MutationReceive, (event, individualsStringified, generationCount, {  }) => {
  const individuals = individualsStringified.map((x) => JSON.parse(x));
  const offsprings = individuals.map(mutateGenotype);
  const stringified = offsprings.map((x) => JSON.parse(x));
  ipcRenderer.send(Worker.MutationFinished, stringified);
});
