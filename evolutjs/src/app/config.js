/**
 * Provides an interface to the application configuration.
 * Takes care of deafault values for necessary configurations.
 * Exports getter for retrieving values.
 *
 * @module app/config
 */

import { path as appRoot } from 'app-root-path';
import defaultConfig from './defaultConfig';
import nconf from 'nconf';
import path from 'path';

/**
 * Path to the default configuration file.
 *
 * @type {String}
 */
const configPath = path.join(appRoot, 'config/default.json');

/**
 * Path to the mutation configuration file.
 *
 * @type {String}
 */
const mutationConfigPath = path.join(appRoot, 'config/mutation.json');

// Load the configurations in the following order:
// 1. Environment variables
// 2. Process arguments
// 3. Configuration files (default, mutation)
// 4. Defaults
nconf.env().argv().file(configPath).file('mutation', mutationConfigPath).defaults(defaultConfig);

/**
 * Returns the value for a configuration key
 *
 * @param  {String} key A colon delimited string
 * @return {*} The configuration value
 */
export default function get(key) {
  return nconf.get(key.replace('.', ':'));
}
