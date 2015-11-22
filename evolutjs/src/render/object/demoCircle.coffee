p2 = require 'p2'
Random = (require 'random-js')()

P2Pixi = require './../../../lib/p2Pixi.js'

randomPosition = ->
  [Random.integer(0, 20), Random.integer(15, 25)]

randomColor = ->
  parseInt (Random.hex 6), 16

class Circle extends P2Pixi.GameObject

  constructor: (game) ->
    super game

    bodyOptions =
      collisionGroup: Random.integer(2, 20)
      collisionMask: 1

    body = new p2.Body
      position: randomPosition()
      mass: Random.integer(2, 200)

    console.log randomColor()

    circle = new p2.Circle
      radius: .25

    style =
      lineWidth: 1
      lineColor: randomColor()
      fillColor: randomColor()

    @addBody body
    @addShape body, circle, [0, 0], 0, bodyOptions, style

root = exports ? this
root.Circle = Circle
