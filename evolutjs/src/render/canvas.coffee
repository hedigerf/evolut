fs = require 'fs'
path = require 'path'
canvasBuffer = require 'electron-canvas-to-buffer'

###*
 * Returns the path of an output image
 * @param  {String} name
 * @return {String}
###
imagePath = (name) ->
  path.join __dirname, 'assets/images', path.basename(name)

###*
 * Writes a canvas dom element to a picture
 * @param  {Node} canvas
 * @param  {String} imageName
###
dumpCanvas = (canvas, imageName) ->
  fs.writeFile imagePath(imageName), canvasBuffer(canvas)

module.exports = dumpCanvas
