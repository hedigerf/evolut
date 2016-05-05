/**
 * Genotyp module.
 *
 * @module algorithm/genotype/genotype
 */

import * as L from 'partial.lenses';
import { always, curry, either, ifElse, mapObjIndexed, merge, view } from 'ramda';
import { IdentifiableStatic } from '../../types/identifiable';
import { SeedableStatic } from '../../types/seedable';

/**
 * @typedef {function(T: PartialGenotype, option: Object): Object} PartialGenotypeProcessor
 */

/**
 * Extract the options for a certain key.
 * This is needed while processing the seed because the constructors
 * of partial genotypes only accept their options at the top level of an object.
 *
 * @param {String} key The property name
 * @return {function(key: Object): Object} The option object
 */
const extractOption = (key) => either(
  view(L.prop(key)),
  always({})
);

/**
 * Builds a partial genotype.
 *
 * @param {PartialGenotype} T The constructor of a partial genotype
 * @param {Object} option The build options
 * @return {PartialGenotype} The instance of a partial genotype
 */
const buildType = (T, option) => new T(option);

/**
 * Seeds a partial genotype.
 *
 * @param {SeedableStatic} T The partial genotype
 * @param {Object} option The build options
 * @return {Object} The seed object
 */
const seedType = (T, option) => T.seed(option);

/**
 * Check if a part of the part object is a constructor derived from PartialGenotype.
 *
 * @param {*} T
 * @return {Boolean}
 */
const isPartialGenotype = (T) => PartialGenotype.prototype.isPrototypeOf(T.prototype);

/**
 * Processes a genotype or maps an array or object.
 *
 * @param {PartialGenotypeProcessor} operation
 * @param {Object} options
 * @param {PartialGenotype|Array|Object} type
 * @param {String} key
 * @return {Object}
 */
const processPartialGenotype = curry((operation, options, type, key) => {

  const partialOptions = extractOption(key)(options);
  const applyOperation = ifElse(isPartialGenotype,
    (T) => operation(T, partialOptions),
    mapObjIndexed(processPartialGenotype(operation, partialOptions)) // Process nested object
  );

  return applyOperation(type);
});

/**
 * Maps a part object with a given function.
 * A part object is a nested object containing partial genotypes.
 *
 * @param {PartialGenotypeProcessor} operation
 * @param {Object} options
 * @param {Object} parts
 */
const processGenotypeParts = curry(
  (operation, options, parts) => mapObjIndexed(processPartialGenotype(operation, options), parts)
);

/**
 * Base class of a genotype.
 *
 * @extends {SeedableStatic}
 */
export default class Genotype extends SeedableStatic() {

  /**
   * Default genotype constructor.
   *
   * @param {Object} genotype The whole genotype as object
   */
  constructor(genotype) {
    super();
    const built = this.constructor.build(genotype);
    for (const property in built) {
      this[property] = built[property];
    }
  }

  /**
   * Returns a (nested) object containing the build order of a genotype.
   *
   * @return {Object}
   */
  static get parts() {
    return {};
  }

  /**
   * Responsible for building an genotype with the provided building instructions.
   * A genotype may define it's build order as a (nested) object of partial genotypes.
   * These may then contain a build order itself.
   *
   * @param {Object} options
   * @return {Object}
   */
  static build(options) {
    return processGenotypeParts(buildType, options, this.parts);
  }

  /**
   * Returns a randomly seeded version of a genotype.
   *
   * @param {Object} options
   * @return {Object}
   */
  static seed(options) {
    return processGenotypeParts(seedType, options, this.parts);
  }

  /**
   * Returns the current blueprint of a genotype's instance.
   *
   * @return {Object}
   */
  blueprint() {
    return JSON.stringify(this);
  }

}

/**
 * Represents a part of a genotype.
 * A part needs an identifiert to extract the specific part
 * from the whole genotype.
 *
 * @extends {Genotype}
 * @extends {IdentifiableStatic}
 */
export class PartialGenotype extends IdentifiableStatic(Genotype) {

  /**
   * @param {Object} options
   * @return {Object}
   */
  static seed(options) {
    return merge(super.seed(options), options);
  }

}
