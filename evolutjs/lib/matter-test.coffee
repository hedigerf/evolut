jQuery = require('jquery')
Matter = require('matter-js')

jQuery(document).ready ->
  Engine = Matter.Engine
  World = Matter.World
  Bodies = Matter.Bodies
  Body = Matter.Body
  Events = Matter.Events
  Constraint = Matter.Constraint
  engine = Engine.create(render:
    element: document.body
    controller: Matter.RenderPixi)
  # create two boxes and a ground
  #var boxA = Bodies.rectangle(400, 200, 80, 80);
  #var boxB = Bodies.rectangle(450, 50, 80, 80);
  boxC = Bodies.rectangle(300, 510, 200, 50)
  leg = Bodies.rectangle(300, 560, 10, 50)
  leg2 = Bodies.rectangle(350, 560, 10, 50)
  leg3 = Bodies.rectangle(250, 560, 10, 50)
  constraint = Constraint.create(
    bodyA: boxC
    bodyB: leg
    pointA:
      x: 0
      y: 50)
  constraint2 = Constraint.create(
    bodyA: boxC
    bodyB: leg2
    pointA:
      x: 50
      y: 50)
  constraint3 = Constraint.create(
    bodyA: boxC
    bodyB: leg3
    pointA:
      x: -50
      y: 50)
  ground = Bodies.rectangle(400, 610, 810, 60, isStatic: true)
  # add all of the bodies to the world
  World.add engine.world, [
    boxC
    leg
    constraint
    leg2
    constraint2
    leg3
    constraint3
    ground
  ]
  Events.on engine, 'tick', (event) ->
    console.log 'tick' + event.timestamp
    Body.translate leg,
      x: 1
      y: 0
    #move body relative to position
    Body.translate leg2,
      x: 1
      y: 0
    #move body relative to position
    Body.translate leg3,
      x: 1
      y: 0
    #move body relative to position
  Events.on engine, 'collisionStart', (event) ->
    collisionIncList = event.pairs
    console.log 'collision is about to start'
  # run the engine
  Engine.run engine
