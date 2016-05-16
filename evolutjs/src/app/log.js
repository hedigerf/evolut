/**
 * Initialize logging.
 *
 * @module app/log
 */

import { ifElse, isNil, once } from 'ramda';
import log4js from 'log4js';

/**
 * Throws an exception.
 *
 * @throws {Error}
 */
function throwMissingUUIDException() {
  throw new Error('Logger can\'t be configured, missing uuid');
}

/**
 * Runs the configuratio of a logger only once.
 *
 * @function
 * @param {String} uuid
 */
const configureOnce = once(ifElse(isNil, throwMissingUUIDException, configure));

/**
 * Load default configuration
 *
 * @param {String} uuid The logger id
 */
function configure(uuid) {
  log4js.configure({
    appenders: [
      {
        type: 'file',
        filename: 'logs/evolutjs_' + uuid + '_full.log',
        maxLogSize: 20480000,
        backups: 10
      },
      {
        type: 'logLevelFilter',
        level: 'ERROR',
        appender: {
          type: 'file',
          filename: 'logs/evolutjs_' + uuid + '_errors.log'
        }
      },
      {
        type: 'console',
        layout: {
          type: 'basic'
        }
      }
    ],
    levels: {
      '[all]': 'DEBUG'
    },
    replaceConsole: true
  });
}

/**
 * Return a configured instance of a logger.
 *
 * @param {String} name The logger name
 * @param {String} uuid The logger id
 * @return {Logger}
 */
export function getLogger(name, uuid) {
  configureOnce(uuid);
  return log4js.getLogger(name);
}
