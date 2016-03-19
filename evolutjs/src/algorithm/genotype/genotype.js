'use strict';

import { compose, ifElse, isArrayLike, map, merge, objOf, of, reduce, toPairs, view } from 'ramda';

const first = pair => pair[0];
const second = pair => pair[1];

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
   * @return {PartialGenotype}
   */
  return function buildPartialGenotype(PartialGenotypeType) {

    // TODO
    // const lensType = lensByIdentifierRecursive(PartialGenotypeType.identifier);
    // const partialGenotype = view(lensType, genotype);

    // jscs:disable
    return new PartialGenotypeType({});
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
   * @return {Object}
   */
  static get parts() {
    return {};
  }

  /**
   * [ {body: {}}, [ [{joint: {}}, {leg: {}}] ] ]
   *
   * @protected
   * @static
   * @param {function} partialTypeOperation
   * @return {Object}
   */
  static processParts(partialTypeOperation) {

    let helper;
    const makeObject = pair => objOf(first(pair), helper(second(pair)));
    const processPairs = (accumulator, pair) => merge(makeObject(pair), accumulator);
    helper = ifElse(isArrayLike, reduce(processPairs, {}), partialTypeOperation);

    return reduce(processPairs, {}, toPairs(this.parts));
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
    const buildPartial = getBuildPartialGenotype(options);
    return this.processParts(buildPartial);
  }

  /**
   * Returns a randomly seeded version of a genotype.
   *
   * [ {body: {}}, [ [{joint: {}}, {leg: {}}] ] ]
   *
   * @static
   * @param {Object} options
   * @return {Object}
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
   * @param {Object} options
   * @return {Object}
   */
  static seed(options) {

    // TODO parts

    return options || [];
  }

}
