/**
 * Provides functionality for coloring individuals and parts.
 *
 * @module render/color
 */

import Random from 'random-js';

const random = new Random(Random.engines.mt19937().autoSeed());

/**
 * Width of a hex color number.
 *
 * @type {Number}
 */
const hexColorWidth = 6;

/**
 * Base of hex color numbers.
 *
 * @type {Number}
 */
const hexColorBase = 16;

/**
* Returns a random color.
*
* @return {Number}
*/
export function randomColor() {
  return parseInt((random.hex(hexColorWidth)), hexColorBase);
}
