/**
 * Provides an interface to the application configuration.
 * Takes care of deafault values for necessary configurations.
 * Exports getter for retrieving values.
 *
 * @module config
 */

import config from 'config';

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
    runDuration: 60,
    render: true,
    solo: false,
    stepTime: 0.016
  }
};

// Mixin configs from configuration file, and make those the defaults
config.util.extendDeep(defaults, config);

/**
 * Returns the value for a configuration key
 *
 * @param  {String} key
 * @return {*}
 */
export default function get(key) {
  return config.get(key);
}
