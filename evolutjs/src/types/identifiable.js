/**
 * Module for identifiable types.
 *
 * @module types/identifiable
 */

/**
 * Applies the Identifiable mixin to a class.
 *
 * @abstract
 * @mixin
 * @param {function} [Base=function() {}] A base class
 * @return {function} The extended, mixed base class
 */
const Identifiable = (Base = function() {}) => class extends Base {

  /**
   * Returns the identifier as string.
   */
  static get identifier() {
    throw new Error('not implemented');
  }

};

export default Identifiable;
