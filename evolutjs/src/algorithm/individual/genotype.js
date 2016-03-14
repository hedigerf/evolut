'use strict';

import { pluck } from 'ramda';

class GenotypeBuilder {

  constructor(buildOrder) {
    //
  }

}

/**
 * Base class of a genotype.
 */
export class Genotype {

  /**
   * Default genotype constructor.
   *
   * @param {Object} genotype The whole genotype as object.
   */
  // jshint -W098
  constructor(genotype) { }

  static seed() {
    // Overwrite..
  }

}

/**
 * Base class for partial genotypes.
 */
export class PartialGenotype {

  /**
   * Default constructor for a partial genotype.
   * Extracts the for this partial genotype specific part of the genotype.
   *
   * @param {Object} genotype The whole genotype.
   */
  constructor(genotype) {
    this.information = pluck(this.identifier)(genotype);
  }

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
   * Returns the specific genotype.
   *
   * @return {Object}
   */
  get information() {
    return this.information;
  }

  seed() {
    // Overwrite..
  }

}
