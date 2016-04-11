/**
 * Provides utilities for path handling within the application.
 *
 * @module util/path
 */

import fs from 'graceful-fs';
import moment from 'moment';
import path from 'path';
import { path as root } from 'app-root-path';

export const ASSETS = 'assets';
export const CONFIG = 'config';
export const IMAGES = path.join(ASSETS, 'images');
export const REPORTS = path.join(ASSETS, 'reports');
export const TEXTURES = path.join(ASSETS, 'textures');

export function relative(...pathElements) {
  return path.join(root, ...pathElements);
}

/**
 * Returns the path of an output image.
 * Images are stored under assets/images/.
 *
 * @param {String} filename The file name.
 * @return {String}
*/
export function image(filename) {
  return relative(IMAGES, path.basename(filename));
}

export function report(filename) {
  return relative(REPORTS, path.basename(filename));
}

export function texture(filename) {
  return relative(TEXTURES, path.basename(filename));
}

export function createTimePrefix() {
  return moment().format('YYYYMMDDHHmmss');
}

export {
  fs,
  path as default,
  root
}
