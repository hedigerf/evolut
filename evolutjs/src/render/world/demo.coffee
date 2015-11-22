path = require 'path'
Random = (require 'random-js')()

P2Pixi = require './../../../lib/p2Pixi.js'

{CarGround} = require '../object/demoGround'
{Circle} = require '../object/demoCircle'
{Ant} = require '../object/ant'

rockTexturePath = ->
  path.join __dirname, '../../..', 'assets/textures', 'rock.jpg'

###*
 * Demo world
###
class CarDemoGame extends P2Pixi.Game

  constructor: ->
    super
      pixiOptions:
        view: document.getElementById 'viewport'
        transparent: true
        autoResize: true
      assetUrls: [rockTexturePath()]

  beforeRun: ->

    ground = new CarGround this
    circle = new Circle this

    self = this

    [0..200].forEach ->
      new Circle self

    @trackedBody = circle.bodies[0]


root = exports ? this
root.CarDemoGame = CarDemoGame
