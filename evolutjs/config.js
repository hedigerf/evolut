'use strict';

process.env.NODE_CONFIG_STRICT_MODE = false;

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
