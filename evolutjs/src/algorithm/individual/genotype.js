'use strict';

import R from 'ramda';

/**
 * Wrap in an array.
 *
 * @param  {*} object
 * @return {Array<*>}
 */
function arrayify(object) {
  if (!R.isArrayLike(object)) {
    return [object];
  }
  return object;
}

/**
 * Returns either the only element a list has,
 * or the whole list.
 *
 * @param {Array} array
 * @return {*|Array}
 */
function singleOrAll(array) {
  return R.cond([
    [R.compose(R.equals(1), R.length), R.head],
    [R.T, R.identity]
  ])(array);
}

/**
 * Responsible for building an genotype with the provided building instructions.
 * A genotype may define it's build order as a (nested) object of partial genotypes.
 * These may then contain a build order itself.
 */
class GenotypeBuilder {

  // TODO move into genotype

  /**
   * Default constructor of a genotype builder.
   *
   * @param {Array} list The build object.
   * @param {Object} genotype The seeded genotype information.
   * @return {Object}
   */
  constructor(list, genotype) {
    return this.build(list, genotype);
  }

  /**
   * Build the partial genotypes.
   *
   * @param {Array} list
   * @param {Object} genotype
   * @return {Object}
   */
  build(list, genotype) {

    const buildPartial = this.getBuildPartialGenotype(genotype);

    return list.reduce((acc, type) => {

      const types = arrayify(type);
      const id = R.head(types).identifier;
      const instances = types.map(buildPartial);

      return R.assoc(id, singleOrAll(instances), acc);

    }, {});
  }

  /**
   * Returns a build function for a partial genotype.
   *
   * @param  {Object} genotype
   * @return {function(PartialGenotype): PartialGenotype}
   */
  getBuildPartialGenotype(genotype) {

    const getByIndexOrSingle = (partialGenotypes, index = 0) => {
      return R.cond([
        [R.isArrayLike, p => R.nth(index, p)],
        [R.T, R.identity]
      ])(partialGenotypes);
    };

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
    this.instanceParts = new GenotypeBuilder(this.constructor.parts, genotype);
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

      const parts = arrayify(part);
      const id = R.head(parts).identifier;
      const partialOptions = R.pick([id], options);
      const seeds = parts.map(p => R.prop(id, p.seed(partialOptions)));

      return R.assoc(id, singleOrAll(seeds), acc);

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

}
