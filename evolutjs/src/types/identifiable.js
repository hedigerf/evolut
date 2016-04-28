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
   *
   * @return {String}
   */
  static get identifier() {
    return '';
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
   *
   * @return {String}
   */
  get identifier() {
    return '';
  }

};
