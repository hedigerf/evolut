path = require 'path'
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
    new CarGround this
    c = new Circle this
    a = new Ant this

    @world.on 'postStep', ->
      console.log c.bodies[0].position

    @trackedBody = a.bodies[0]

root = exports ? this
root.CarDemoGame = CarDemoGame
