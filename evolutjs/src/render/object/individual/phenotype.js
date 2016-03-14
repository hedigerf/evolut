'use strict';

import P2Pixi from '../../../../lib/p2Pixi';

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
  // jshint -W098
  fromGenotype(genotype) {
    //
  }

}
