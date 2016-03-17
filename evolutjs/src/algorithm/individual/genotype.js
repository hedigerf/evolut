'use strict';

import R from 'ramda';

/**
 * Create an array from an object.
 * If object is already an array then return the array.
 *
 * @param  {*}
 * @return {Array<*>}
 */
const coerceArray = R.unless(R.isArrayLike, R.of);

/**
 * Predicate checks if an array has length 1.
 *
 * @param {Array}
 * @return {Boolean}
 */
const hasLength1 = R.compose(R.equals(1), R.length);

/**
 * Returns either the only element a list has,
 * or the whole list.
 *
 * @param {Array}
 * @return {*|Array}
 */
const unCoerceArray = R.when(hasLength1, R.head);

/**
 * Returns the specified index of a list of partial genotypes,
 * or the object itself.
 *
 * @param  {Array<partialGenotype>|PartialGenotype} partialGenotypes
 * @param  {Number} [index=]
 * @return {PartialGenotype}
 */
function getByIndexOrSingle(partialGenotypes, index = 0) {
  return R.cond([
    [R.isArrayLike, p => R.nth(index, p)],
    [R.T, R.identity]
  ])(partialGenotypes);
}

/**
 * Returns a build function for a partial genotype.
 *
 * @param  {Object} genotype
 * @return {function(PartialGenotype): PartialGenotype}
 */
function getBuildPartialGenotype(genotype) {

  /**
   * Builds a partial genotype with the needed information
   * extracted from the whole genotype.
   *
   * @param {PartialGenotype} PartialGenotypeType
   * @param {Number} index
   * @return {PartialGenotype}
   */
  return function buildPartialGenotype(PartialGenotypeType, index) {

    const id = PartialGenotypeType.identifier;
    const partialGenotypes = R.prop(id, genotype);
    const partialGenotype = getByIndexOrSingle(partialGenotypes, index);

    // jscs:disable
    return new PartialGenotypeType(partialGenotype);
  };
}

/**
 * Responsible for building an genotype with the provided building instructions.
 * A genotype may define it's build order as a (nested) object of partial genotypes.
 * These may then contain a build order itself.
 *
 * @param {Array} list
 * @param {Object} genotype
 * @return {Object}
 */
function buildGenotype(list, genotype) {

  const buildPartial = getBuildPartialGenotype(genotype);

  return list.reduce((acc, type) => {

    const types = coerceArray(type);
    const id = R.head(types).identifier;
    const instances = types.map(buildPartial);

    return R.assoc(id, unCoerceArray(instances), acc);

  }, {});
}

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
    this.instanceParts = buildGenotype(this.constructor.parts, genotype);
  }

  /**
   * Returns a (nested) object containing the build order of a genotype.
   *
   * @static
   * @return {Array}
   */
  static get parts() {
    return [];
  }

  /**
   * Returns a randomly seeded version of a genotype.
   *
   * @static
   * @param {Object} options Provides values for specific parts of a genotypes
   *                         instead of a random value.
   * @return {Object}
   */
  static seed(options) {

    return this.parts.reduce((acc, part) => {

      const parts = coerceArray(part);
      const id = R.head(parts).identifier;
      const partialOptions = R.pick([id], options);
      const seeds = parts.map(p => R.prop(id, p.seed(partialOptions)));

      return R.assoc(id, unCoerceArray(seeds), acc);

    }, {});
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
  static seed(option) {
    return {
      [this.identifier]: option || {}
    };
  }

}
