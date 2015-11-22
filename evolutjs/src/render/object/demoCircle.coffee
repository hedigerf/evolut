P2Pixi = require './../../../lib/p2Pixi.js'
p2 = require 'p2'

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
      radius: .25

    style =
      lineWidth: 1
      lineColor: 0xff0000
      fillColor: 0xffff00

    @addBody body
    @addShape body, circle, [0, 0], 0, bodyOptions, style

root = exports ? this
root.Circle = Circle
