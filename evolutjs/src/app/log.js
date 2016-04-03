/**
 * Initialize loggin.
 *
 * @module app/log
 */

import log4js from 'log4js';
import path from 'path';

/**
 * Path to the default configuration file.
 *
 * @type {String}
 */
const defaultCondfigurationFile = path.join(__dirname, '../../config/log4js.json');

// Load default configuration
log4js.configure(defaultCondfigurationFile);
