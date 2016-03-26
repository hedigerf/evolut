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
    this.movementState = 0;
    this.movementIndex = 0;
  }

  /**
   * @protected
   * @param {Genotype} genotype The genotype representation.
   */
  fromGenotype(genotype) {} // eslint-disable-line no-unused-vars

  /**
   * Returns the current movement this phenotype is in.
   *
   * @return {Number}
   */
  get movement() {
    return this.movementIndex;
  }

  /**
   * Returns the current movement phase this phenotype is in.
   *
   * @return {Number}
   */
  get state() {
    return this.movementState;
  }

  /**
   * Sets the movement this phenotype is in.
   *
   * @param {Number} movement
   */
  set movement(movement) {
    this.movementIndex = movement;
  }

  /**
   * Sets the movement phase this phenotype is in.
   *
   * @param {Number} phase
   */
  set state(phase) {
    this.movementState = phase;
  }

}
