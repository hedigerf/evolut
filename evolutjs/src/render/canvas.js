/**
 * Canvas handling module.
 *
 * @module render/canvas
 */

/* eslint-disable */

// import canvasBuffer from 'electron-canvas-to-buffer';
import fs from 'fs';
import { image } from '../util/path';

/**
 * Writes a canvas dom element to a picture.
 *
 * @param {Node} canvas The canvas element
 * @param {String} imageName The file name
 * @param {String} [mimeType='image/png'] The mime type of the saved file
*/
export default function dumpCanvas(canvas, imageName, mimeType = 'image/png') {

  return;

  // Wait for an updated version of electron-canvas-to-buffer
  // electron 1.0 changed the native-image api

  /*
  const imagePath = image(imageName);
  const buffer = canvasBuffer(canvas, mimeType);
  fs.writeFile(imagePath, buffer);
  */
}
