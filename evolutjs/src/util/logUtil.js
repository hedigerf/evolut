/**
 * Provides performance enhanced log functions.
 *
 * @module util/logUtil
 */

/**
 * Only call logger.debug() if the logger has debug enabled.
 * This should ensure that the built in check in logger.debug() is not invoked
 * because this leads to a huge performance hit.
 *
 * @param {Log4js.Logger} logger logger
 * @param {String} message Debug message
 */
export function debug(logger, message) {
  if (logger && logger.isDebugEnabled()) {
    logger.debug(message);
  }
}

/**
 * Only call logger.info() if the logger has info enabled.
 * This should ensure that the built in check in logger.info() is not invoked
 * because this leads to a huge performance hit.
 *
 * @param {Log4js.Logger} logger logger
 * @param {String} message Info message
 */
export function info(logger, message) {
  if (logger && logger.isInfoEnabled()) {
    logger.info(message);
  }
}

/**
* Only call logger.error() if the logger has error enabled.
* This should ensure that the built in check in logger.error() is not invoked
* because this leads to a huge performance hit.
*
* @param {Log4js.Logger} logger logger
* @param {String} message Error message
*/
export function error(logger, message) {
  if (logger && logger.isErrorEnabled()) {
    logger.error(message);
  }
}
