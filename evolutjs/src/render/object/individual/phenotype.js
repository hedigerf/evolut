/**
 * Phenotyp module.
 *
 * @module render/object/individual/phenotype
 */

// import P2Pixi from '../../../../lib/p2Pixi';
import { GameObject } from '../../../../lib/p2Pixi.es6';
import uuid from 'uuid';

import { decorateAccessor, memoize } from '../../../util/decorate';
import { Identifiable } from '../../../types/identifiable';

/**
 * Represents a phenotype.
 *
 * @extends {GameObject}
 * @extends {Identifiable}
 */
class Phenotype extends Identifiable(GameObject) {

  /**
   * @param {Game} world
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

  /**
   * Returns the identifier for this phenotype.
   *
   * @return {String}
   */
  get identifier() {
    return uuid.v4();
  }

}

// Decorate the static accessors (or the property) 'identifier'
// The goal is to memoize this accessor and store it's result.
// Every consecutive call to this accessor will return the stored result.
decorateAccessor(memoize, 'identifier', Phenotype);

export default Phenotype;
