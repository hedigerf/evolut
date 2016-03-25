/**
 * Movement engine module.
 *
 * @module engine/engine
 */

/**
 * Represents an abstract class for an engine.
 * It's responsibility is moving an phenotype's legs.
 * An engine consists of multiple movement phases.
 * A phase itself may consist of multiple movements
 */
export default class Engine {

  /**
   * Returns all phases of this movement.
   *
   * @return {Array<MovementPhase>}
   */
  static get phases() {
    return [];
  }

  /**
   * Applies the initial step of an engine.
   * This most often comes down to initialize the movement,
   * angles and velocitities of constraints, and the position of bodies.
   *
   * @param {Phenotype} phenotype Applies the movement of this engine to this phenotype.
   */
  static initialStep(phenotype) {} // eslint-disable-line no-unused-vars

  /**
   * Executes a single step of the engine.
   *
   * @param {Phenotype} phenotype Applies the movement of this engine to this phenotype.
   * @param {Number} time The current world time.
   */
  static step(phenotype, time) {} // eslint-disable-line no-unused-vars

}
