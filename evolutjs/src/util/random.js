/**
 * Provides an initialized random generator with mersenne twister engine.
 *
 * @module util/random
 */

import Random  from 'random-js';

/**
 * Random number generator with mersenne twister engine.
 *
 * @param {Random}
 */
const random = new Random(Random.engines.mt19937().autoSeed());

export default random;
