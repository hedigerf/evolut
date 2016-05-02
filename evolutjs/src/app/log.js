/**
 * Initialize loggin.
 *
 * @module app/log
 */

import log4js from 'log4js';
import { once } from 'ramda';

const configureOnce = once((uuid) => {
  if (!uuid) {
    throw 'Loger cant be configured, missing uuid';
  }
  configure(uuid);
});

// Load default configuration
function configure(uuid) {

  log4js.configure({
    appenders: [
      {
        type: 'file',
        filename: 'logs/evolutjs_' + uuid + '_full.log',
        maxLogSize: 204800,
        backups: 3
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


export function getLogger(name, uuid) {
  configureOnce(uuid);
  return log4js.getLogger(name);

}
