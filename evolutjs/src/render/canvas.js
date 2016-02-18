var fs = require('fs');
var path = require('path');
var canvasBuffer = require('electron-canvas-to-buffer');

/**
 * Returns the path of an output image
 * @param  {String} name
 * @return {String}
*/
var imagePath = function(name) {
  return path.join(__dirname, 'assets/images', path.basename(name));
};

/**
 * Writes a canvas dom element to a picture
 * @param  {Node} canvas
 * @param  {String} imageName
*/
var dumpCanvas = function(canvas, imageName) {
  return fs.writeFile(imagePath(imageName), canvasBuffer(canvas));
};

module.exports = dumpCanvas;
