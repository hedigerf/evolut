
PIXI         = require 'pixi.js'
P2Pixi       = require './lib/p2Pixi'
jQuery       = require 'jquery'
canvasBuffer = require 'electron-canvas-to-buffer'
fs           = require 'fs'
path         = require 'path'

cosAmp = (x, amp) ->
  Math.cos(x * amp)

toHeight = (i) ->
  cos = (a) ->
    cosAmp i, a
  cos(.2) * cos(.5) * cos(.1) * cos(.05)

rockTexturePath = ->
  path.join __dirname, 'assets/textures', 'rock.jpg'

# Creates a new height field
createHeightField = ->
  new p2.Heightfield
    heights: [1..500].map toHeight
    elementWidth: .3
    material: new p2.Material()

# Writes the canvas content to an image
dumpCanvas = (canvas, imageName) ->
  imagePath = path.join __dirname, 'assets/images', path.basename(imageName)
  fs.writeFile imagePath, canvasBuffer(canvas)


# Car demo game
class CarDemoGame extends P2Pixi.Game

  constructor: ->
    super
      pixiOptions:
        view: document.getElementById 'viewport'
        transparent: true
      assetUrls: [rockTexturePath()]

	# @override
  beforeRun: ->
    new CarGround this


  afterRender: ->
    dumpCanvas @pixiAdapter.renderer.view, 'image.png'
    @afterRender = ->



#
# Ground
#
class CarGround extends P2Pixi.GameObject

  constructor: (game) ->

    super game

    bodyOptions =
      collisionMask: 1 | 2

    texture = PIXI.Texture.fromImage rockTexturePath(), false

    body = new p2.Body
      position: [0, 10]
      mass: 0

    @addBody body
    @addShape body, createHeightField(), [0, 0], 0, bodyOptions, null, texture, .5


class Circle extends P2Pixi.GameObject

  constructor: (game) ->
    super game

    bodyOptions =
      collisionMask: 1 | 2

    body = new p2.body
      position: [50, 50]
      mass: 4

    @addBody body
    @addShape body, null, [0, 0], 0, bodyOptions


jQuery ->
  new CarDemoGame()
