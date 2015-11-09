require 'pixi.js'

jQuery = require 'jquery'
Matter = require 'matter-js'

Bodies = Matter.Bodies
Body = Matter.Body
Composite = Matter.Composite
Constraint = Matter.Constraint
Engine = Matter.Engine
Events = Matter.Events
Vector = Matter.Vector
World = Matter.World

makeCarBody = (group, posX, posY, width, height) ->
  Bodies.trapezoid posX, posY, width, height, .3,
    collisionFilter:
      group: group
    friction: .01
    chamfer:
      radius: 10


makeCarWheel = (group, posX, posY, wheelXOffset, wheelYOffset, wheelSize) ->
  Bodies.circle posX + wheelXOffset, posY + wheelYOffset, wheelSize,
    collisionFilter:
      group: group
    restitution: .5
    friction: .9
    frictionStatic: 10
    slop: .5
    density: .01


makeCarAxe = (body, wheel, wheelXOffset, wheelYOffset) ->
  Constraint.create
    bodyA: body
    pointA:
      x: wheelXOffset
      y: wheelYOffset
    bodyB: wheel
    stiffnes: 1


makeCar = (posX, posY, width, height, wheelSize) ->

  group = Body.nextGroup true

  wheelBase = -20
  wheelAOffset = -width / 1.8 + wheelBase
  wheelBOffset = width / 1.8 - wheelBase
  wheelYOffset = 0

  car = Composite.create
    force: Vector.create 0, 0
    label: 'a car'
    parts: []
    position: Vector.create posX, posY
    positionPrev: Vector.create posX, posY

  body = makeCarBody group, posX, posY, width, height

  wheelA = makeCarWheel group, posX, posY, wheelAOffset, wheelYOffset, wheelSize
  wheelB = makeCarWheel group, posX, posY, wheelBOffset, wheelYOffset, wheelSize

  axeA = makeCarAxe body, wheelA, wheelAOffset, wheelYOffset
  axeB = makeCarAxe body, wheelB, wheelBOffset, wheelYOffset

  Composite.addBody car, body
  Composite.addBody car, wheelA
  Composite.addBody car, wheelB

  Composite.addConstraint car, axeA
  Composite.addConstraint car, axeB

  car

makeGround = ->
  Bodies.rectangle 400, 610, 810, 60, isStatic: true

onTickMoveBody = (body) -> (event) ->
  #Body.applyForce body, Vector.create(0, 60), Vector.create(10, 0)
  Body.translate body, Vector.create(5, 0)

makeWorld = ->

  engine = Engine.create
    render:
      element: document.body,
      controller: Matter.RenderPixi
      options:
        showAngleIndicator: true
        showCollisions: true

  car = makeCar 300, 300, 100, 40, 30
  ground = makeGround()

  World.add engine.world, [car, ground]

  Events.on engine, 'tick', (event) ->
    Body.translate car, Vector.create 5,0

  Engine.run engine

jQuery(document).ready ->
  makeWorld()
