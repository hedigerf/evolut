/**
 * Lenses for accessing constraints.
 *
 * @module engine/constraintLenses
 */

import * as L from 'partial.lenses';
import { lens } from 'ramda';

/**
 * @typedef {{
 *   side: String,
 *   index: Number,
 *   type: String
 * }} LensDescriptor
 */

/**
 * Lens for immutable-js data types.
 *
 * @function
 * @param {String} key
 * @return {Lens}
 */
export const immutableLens = (key) => lens((x) => x.get(key), (val, x) => x.set(key, val));

/**
 * Create a lens desriptor object.
 *
 * @param {String} side The side, left or right
 * @param {Number} index The leg index
 * @param {String} type The type, hip or joint
 * @return {LensDescriptor} The lens descriptor
 */
export function makeLensDescriptor(side, index, type) {
  return { side, index, type };
}

/**
 * Resolve a lens descriptor and return the lens.
 *
 * @param {LensDescriptor} descriptor
 * @return {Lens} The lens
 */
export function resolveLensDecriptor({ side, index, type }) {
  return L.compose(
    L.prop('jointsMap'),
    immutableLens(side),
    immutableLens(index),
    L.prop(type)
  );
}
