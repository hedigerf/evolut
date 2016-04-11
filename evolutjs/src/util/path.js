/**
 * Provides utilities for path handling within the application.
 *
 * @module util/path
 */

import fs from 'graceful-fs';
import moment from 'moment';
import path from 'path';
import { path as root } from 'app-root-path';

/**
 * Format for createTimePrefix.
 *
 * @type {String}
 */
const TIMESTAMP_FORMAT = 'YYYYMMDDHHmmss';

// Application paths
export const ASSETS = 'assets';
export const CONFIG = 'config';
export const IMAGES = path.join(ASSETS, 'images');
export const REPORTS = path.join(ASSETS, 'reports');
export const TEXTURES = path.join(ASSETS, 'textures');

/**
 * Returns a joined path with the application root as first element.
 *
 * @param {String} filename The file name.
 * @return {String}
 */
export function relative(...pathElements) {
  return path.join(root, ...pathElements);
}

/**
 * Returns the path of an image.
 *
 * @param {String} filename The file name.
 * @return {String}
 */
export function image(filename) {
  return relative(IMAGES, path.basename(filename));
}

/**
 * Returns the path of a report.
 *
 * @param {String} filename The file name.
 * @return {String}
 */
export function report(filename) {
  return relative(REPORTS, path.basename(filename));
}

/**
 * Returns the path of a texture.
 *
 * @param {String} filename The file name.
 * @return {String}
 */
export function texture(filename) {
  return relative(TEXTURES, path.basename(filename));
}

/**
 * Returns the a timestamp prefix.
 *
 * @param {String} filename The file name.
 * @return {String}
 * @see TIMESTAMP_FORMAT
 */
export function createTimePrefix() {
  return moment().format(TIMESTAMP_FORMAT);
}

export {
  fs,
  path as default,
  root
};
