'use strict';

import { append, concat, ifElse, isArrayLike, reduce, view } from 'ramda';

import { lensByIdentifierRecursive } from '../../util/lens';

/**
 * Returns a build function for a partial genotype.
 *
 * @param  {Array} genotype
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

    // TODO
    const lensType = lensByIdentifierRecursive(PartialGenotypeType.identifier);
    const partialGenotype = view(lensType, genotype);

    // jscs:disable
    return new PartialGenotypeType(partialGenotype);
  };
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
    this.instanceParts = this.constructor.build(genotype);
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
   * [ {body: {}}, [ [{joint: {}}, {leg: {}}] ] ]
   *
   * @protected
   * @static
   * @param {Array} options
   * @return {Array}
   */
  static processParts(partialTypeOperation) {

    let helper;
    const reducer = (accumulator, type) => append(helper(type), accumulator);
    helper = ifElse(isArrayLike, reduce(reducer, []), partialTypeOperation);

    return reduce(reducer, [], this.parts);
  }

  /**
   * Responsible for building an genotype with the provided building instructions.
   * A genotype may define it's build order as a (nested) object of partial genotypes.
   * These may then contain a build order itself.
   *
   * @static
   * @param {Array} options
   * @return {Array}
   */
  static build(options) {
    const buildPartial = getBuildPartialGenotype(options);
    return this.processParts(buildPartial);
  }

  /**
   * Returns a randomly seeded version of a genotype.
   *
   * [ {body: {}}, [ [{joint: {}}, {leg: {}}] ] ]
   *
   * @static
   * @param {Array} options
   * @return {Array}
   */
  static seed(options) {
    // g => g.seed(options)
    return this.processParts(g => g.seed(options));
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
   * @param {Array} options
   * @return {Array}
   */
  static seed(options) {
    // TODO parts
    return options || [];
  }

}
