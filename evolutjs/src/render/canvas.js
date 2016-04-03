/**
 * Canvas handling module.
 *
 * @module render/canvas
 */

import { path as appRoot } from 'app-root-path';
import fs from 'fs';
import path from 'path';
import canvasBuffer from 'electron-canvas-to-buffer';

/**
 * Returns the path of an output image.
 * Images are stored under assets/images/.
 *
 * @param {String} name The file name.
 * @return {String}
*/
function imagePath(name) {
  return path.join(appRoot, 'assets/images', path.basename(name));
}

/**
 * Writes a canvas dom element to a picture.
 *
 * @param {Node} canvas
 * @param {String} imageName
*/
export default function dumpCanvas(canvas, imageName) {
  fs.writeFile(imagePath(imageName), canvasBuffer(canvas));
}
