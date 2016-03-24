/**
 * Phenotyp module.
 *
 * @module render/object/individual/phenotype
 */

import MovementPhase from '../../../engine/movementPhase'
import P2Pixi from '../../../../lib/p2Pixi';

export default class Phenotype extends P2Pixi.GameObject {

  /**
   * @param {P2Pixi.GameObject} world
   * @param {Genotype} genotype
   */
  constructor(world, genotype) {
    super(world);
    this.fromGenotype(genotype);
    this.movementPhase = MovementPhase(genotype.instanceParts.engine);
  }

  /**
   * @protected
   * @param {Genotype} genotype The genotype representation.
   */
  // jshint -W098
  fromGenotype(genotype) {
    //
  }

  /**
   * Returns the current movement phase this phenotype is in.
   *
   * @return {MovementPhase}
   */
  get phase() {
    return this.movementPhase;
  }

  /**
   * Sets the movement phase this phenotype is in.
   *
   * @param {MovementPhase} nextPhase
   */
  set phase(nextPhase) {
    this.movementPhase = nextPhase;
  }

}
