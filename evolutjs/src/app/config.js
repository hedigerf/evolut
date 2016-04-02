/**
 * Provides an interface to the application configuration.
 * Takes care of deafault values for necessary configurations.
 * Exports getter for retrieving values.
 *
 * @module app/config
 */

import config from 'config';

/**
 * Average acceleration on earth.
 *
 * @type {Number}
 */
const EARTH_GRAVITY = -9.81;

/**
 * Default configuration
 *
 * @type {Object}
 * @property {Object} defaults.window
 * @property {Number} defaults.window.height
 * @property {Number} defaults.window.width
 */
const defaults = {
  window: {
    height: 720,
    width: 1280
  },
  simulation: {
    friction: 1000,
    gravity: [0, EARTH_GRAVITY],
    render: true,
    runDuration: 60,
    solo: false,
    stepTime: 0.016
  }
};

// Mixin configs from configuration file, and make those the defaults
config.util.extendDeep(config, config.util.extendDeep(defaults, config));

/**
 * Returns the value for a configuration key
 *
 * @param  {String} key
 * @return {*}
 */
export default function get(key) {
  return config.get(key);
}
