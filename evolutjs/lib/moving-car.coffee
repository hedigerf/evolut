jQuery = require 'jquery'
Matter = require 'matter-js'

require './lib/functional'

Bodies = Matter.Bodies
Body = Matter.Body
Composite = Matter.Composite
Composites = Matter.Composites
Constraint = Matter.Constraint
Engine = Matter.Engine
Events = Matter.Events
Vector = Matter.Vector
World = Matter.World


makeGround = ->
  Bodies.rectangle 400, 610, 810, 60, isStatic: true


makeUpperGround = ->
  Bodies.rectangle 100, 300, 400, 10,
		isStatic: true
		angle: -6.02


makeCar = (x, y) ->
	car = Composites.car x, y, 100, 40, 30
	car.position = Vector.create x, y
	car.positionPrev = Vector.create x, y
	car.force = Vector.create 0, 0
	car


accelerateComposite = (obj, force, offset) ->
	bodies = Composite.allBodies obj
	body = bodies[0]
	accelerateBody bodies[0], force, offset


accelerateBody = (body, force, offset) ->
	point = Vector.create(body.position.x + offset, body.position.y)
	direction = Vector.create(force, 0)
	Body.applyForce body, point, direction


makeVerboseEngine = ->
	Engine.create
		render:
			element: document.body
			controller: Matter.RenderPixi
			options:
				wireframes: true
				showVelocity: true
				showAxes: true
				showCollisions: true
				showAngleIndicator: true


makeWorld = ->
	engine = makeVerboseEngine()

	ground = makeGround()
	slope = makeUpperGround()
	circle = Bodies.circle 50, 570, 20, friction: .5

	car = makeCar 100, 250
	car2 = makeCar 300, 570

	World.add engine.world, [slope, car2, circle, car, ground]

	Events.on engine, 'tick', ->
		accelerateComposite car, -.0032, -100
		accelerateBody circle, .01, 1

	Engine.run engine

	true


jQuery(document).ready ->
  makeWorld()
