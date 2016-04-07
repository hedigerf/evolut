/**
 * Provides an interface to the application configuration.
 * Takes care of deafault values for necessary configurations.
 * Exports getter for retrieving values.
 *
 * @module app/config
 */

import { path as appRoot } from 'app-root-path';
import nconf from 'nconf';
import path from 'path';

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
 * @property {Object} defaults.simulation
 * @property {Number} defaults.simulation.friction
 * @property {Array<Number>} defaults.simulation.gravity
 * @property {Boolean} defaults.simulation.render
 * @property {Number} defaults.simulation.runDuration
 * @property {Boolean} defaults.simulation.solo
 * @property {Number} defaults.simulation.stepTime
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
    runDuration: 20,
    solo: false,
    stepTime: 0.016
  }
};

/**
 * Path to the default configuration file.
 *
 * @type {String}
 */
const configPath = path.join(appRoot, 'config/default.json');

// Load the configurations in the following order:
// 1. Environment variables
// 2. Process arguments
// 3. Configuration file
// 4. Defaults
nconf.env().argv().file(configPath).defaults(defaults);

/**
 * Returns the value for a configuration key
 *
 * @param  {String} key A colon delimited string
 * @return {*} The configuration value
 */
export default function get(key) {
  return nconf.get(key.replace('.', ':'));
}
