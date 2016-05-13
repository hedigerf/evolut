/**
 * Canvas handling module.
 *
 * @module render/canvas
 */

import fs from 'fs';
import { image } from '../util/path';
import { nativeImage } from 'electron';

/**
 * Available image mime types.
 *
 * @type {Array<String>}
 */
const types = ['image/png', 'image/jpg', 'image/jpeg'];

/**
 * Returns a buffer representing the specified canvas element.
 *
 * @param {Node} canvas The canvas element
 * @param {String} [type='image/png'] The mime type
 * @param {Number} [quality=0.9] The jpg image quality
 * @return {nativeImage}
 * @throws {Error}
 */
function canvasBuffer(canvas, type, quality) {

  type = type || 'image/png';
  quality = typeof quality === 'number' ? quality : 0.9;

  if (types.indexOf(type) === -1) {
    throw new Error('unsupported image type ' + type);
  }

  const data = canvas.toDataURL(type, quality);
  const img = nativeImage.createFromDataURL(data);

  if (/^image\/jpe?g$/.test(type)) {
    return img.toJpeg(Math.floor(quality * 100));
  }
  return img.toPng();
}

/**
 * Writes a canvas dom element to a picture.
 *
 * @param {Node} canvas The canvas element
 * @param {String} imageName The file name
 * @param {String} [mimeType='image/png'] The mime type of the saved file
*/
export default function dumpCanvas(canvas, imageName, mimeType = 'image/png') {

  const imagePath = image(imageName);
  const buffer = canvasBuffer(canvas, mimeType);

  fs.writeFile(imagePath, buffer);
}
