/**
 * Phenotyp module.
 *
 * @module render/object/individual/phenotype
 */

import P2Pixi from '../../../../lib/p2Pixi';

/**
 * Represents a phenotype.
 *
 * @extends {P2Pixi.GameObject}
 */
export default class Phenotype extends P2Pixi.GameObject {

  /**
   * @param {P2Pixi.GameObject} world
   * @param {Genotype} genotype
   */
  constructor(world, genotype) {
    super(world);
    this.fromGenotype(genotype);
  }

  /**
   * @protected
   * @param {Genotype} genotype The genotype representation.
   */
  fromGenotype(genotype) {} // eslint-disable-line no-unused-vars

}
