'use strict';

import L from 'partial.lenses';
import { always, curry, either, ifElse, mapObjIndexed, merge, view } from 'ramda';

const extractOption = key => either(
  view(L.prop(key)),
  always({})
);

const buildType = (T, option) => new T(option);
const seedType = (T, option) => T.seed(option);

// jshint -W003
const isPartialGenotype = T => PartialGenotype.prototype.isPrototypeOf(T.prototype);

/**
 * Processes a genotype or maps an array or object.
 *
 * @param {function(PartialGenotype, Object): Object} operation
 * @param {Object} options
 * @param {PartialGenotype|Array|Object} type
 * @param {String} key
 * @return {Object}
 */
const processPartialGenotype = curry((operation, options, type, key) => {

  const partialOptions = extractOption(key)(options);
  const applyOperation = ifElse(isPartialGenotype,
    T => operation(T, partialOptions),
    mapObjIndexed(processPartialGenotype(operation, partialOptions)) // Process nested object
  );

  return applyOperation(type);
});

/**
 * Maps a part object with a given function.
 * A part object is a nested object containing partial genotypes.
 *
 * @param {function(PartialGenotype, Object): Object} operation
 * @param {Object} options
 * @param {Object} parts
 */
const processGenotypeParts = curry(
  (operation, options, parts) => mapObjIndexed(processPartialGenotype(operation, options), parts)
);

/**
 * Base class of a genotype.
 */
export default class Genotype {

  /**
   * Default genotype constructor.
   *
   * @param {Object} genotype The whole genotype as object.
   */
  constructor(genotype) {
    this.instanceParts = this.constructor.build(genotype);
  }

  /**
   * Returns a (nested) object containing the build order of a genotype.
   *
   * @static
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
   * @static
   * @param {Object} options
   * @return {Object}
   */
  static build(options) {
    return processGenotypeParts(buildType, options, this.parts);
  }

  /**
   * Returns a randomly seeded version of a genotype.
   *
   * @static
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
    return JSON.stringify(this.instanceParts);
  }

}

/**
 * Represents a part of a genotype.
 * A part needs an identifiert to extract the specific part
 * from the whole genotype.
 */
export class PartialGenotype extends Genotype {

  /**
   * Returns the identifier for a partial genotype.
   *
   * @static
   * @return {String}
   */
  static get identifier() {
    return '';
  }

  /**
   * @override
   * @static
   * @param {Object} options
   * @return {Object}
   */
  static seed(options) {
    return merge(super.seed(options), options);
  }

}
