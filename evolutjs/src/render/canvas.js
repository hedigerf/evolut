let fs = require('fs');
let path = require('path');
let canvasBuffer = require('electron-canvas-to-buffer');

/**
 * Returns the path of an output image
 * @param  {String} name
 * @return {String}
*/
let imagePath = function(name) {
  return path.join(__dirname, 'assets/images', path.basename(name));
};

/**
 * Writes a canvas dom element to a picture
 * @param  {Node} canvas
 * @param  {String} imageName
*/
let dumpCanvas = function(canvas, imageName) {
  return fs.writeFile(imagePath(imageName), canvasBuffer(canvas));
};

module.exports = dumpCanvas;
