/**
 * Initialize loggin.
 *
 * @module app/log
 */

import { path as appRoot } from 'app-root-path';
import log4js from 'log4js';
import path from 'path';

/**
 * Path to the default configuration file.
 *
 * @type {String}
 */
const defaultCondfigurationFile = path.join(appRoot, 'config/log4js.json');

// Load default configuration
log4js.configure(defaultCondfigurationFile);
