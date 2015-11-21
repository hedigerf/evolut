
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
        autoResize: true
      assetUrls: [rockTexturePath()]

  beforeRun: ->
    new CarGround this
    c = new Circle this

    @world.on 'postStep', ->
      console.log c.bodies[0].position

    @trackedBody = c.bodies[0]

#
# Ground
#
class CarGround extends P2Pixi.GameObject

  constructor: (game) ->
    super game

    bodyOptions =
      collisionGroup: 1
      collisionMask: 1 | 2

    texture = PIXI.Texture.fromImage rockTexturePath(), false

    body = new p2.Body
      position: [0, -20]
      mass: 0

    @addBody body
    @addShape body, createHeightField(), [0, 10], 0, bodyOptions, null, texture


class Circle extends P2Pixi.GameObject

  constructor: (game) ->
    super game

    bodyOptions =
      collisionGroup: 2
      collisionMask: 1

    body = new p2.Body
      position: [0, 10]
      mass: 4

    circle = new p2.Circle
      radius: 1

    style =
      lineWidth: 12
      lineColor: 0xff0000
      fillColor: 0x00ff00

    @addBody body
    @addShape body, circle, [0, 0], 0, bodyOptions, style


jQuery ->
  new CarDemoGame()
