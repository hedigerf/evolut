p2 = require 'p2'
path = require 'path'
PIXI = require 'pixi.js'

P2Pixi = require './../../../lib/p2Pixi'

cosAmp = (x, amp) ->
  Math.cos(x * amp)

toHeight = (i) ->
  cos = (a) ->
    cosAmp i, a
  cos(.2) * cos(.5) * cos(.1) * cos(.05)

rockTexturePath = ->
  path.join __dirname, '../../..', 'assets/textures', 'rock.jpg'

# Creates a new height field
createHeightField = ->
  new p2.Heightfield
    heights: [1..500].map toHeight
    elementWidth: .3
    material: new p2.Material()

module.exports =
  
  class CarGround extends P2Pixi.GameObject

    constructor: (game) ->
      super game

      bodyOptions =
        collisionGroup: 1
        collisionMask: 1 | 2

      texture = PIXI.Texture.fromImage rockTexturePath(), false

      body = new p2.Body
        position: [-75, -10]
        mass: 0

      @addBody body
      @addShape body, createHeightField(), [0, 0], 0, bodyOptions, null, texture
