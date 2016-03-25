/**
 * Provides movement functionality for engines.
 *
 * @module engine/movement
 */

/**
 * Represents a single movement of a phonotype.
 * A movement could be locking the angle of a joint.
 * Or setting the speed of joint's motor.
 */
export default class Movement {

  /**
   * Apply the movemement to a phenotype.
   *
   * @param {Phenotype} phenotype The target phenotype
   * @return {Phenotype}
   */
  static move(phenotype) {
    return phenotype;
  }

  static feedback(object) {} // eslint-disable-line no-unused-vars

}
