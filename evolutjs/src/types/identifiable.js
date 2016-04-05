/**
 * Module for identifiable types.
 *
 * @module types/identifiable
 */

/**
 * Applies the IdentifiableStatic mixin to a class.
 *
 * @abstract
 * @mixin
 * @param {function} [Base=function() {}] A base class
 * @return {function} The extended, mixed base class
 */
export const IdentifiableStatic = (Base = function() {}) => class extends Base {

  /**
   * Returns the identifier as string.
   */
  static get identifier() {
    throw new Error('not implemented');
  }

};

/**
 * Applies the Identifiable mixin to a class.
 *
 * @abstract
 * @mixin
 * @param {function} [Base=function() {}] A base class
 * @return {function} The extended, mixed base class
 */
export const Identifiable = (Base = function() {}) => class extends Base {

  /**
   * Returns the identifier as string.
   */
  get identifier() {
    throw new Error('not implemented');
  }

};
