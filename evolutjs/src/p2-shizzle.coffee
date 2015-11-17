
PIXI   = require 'pixi.js'
P2Pixi = require 'p2Pixi'
jQuery = require 'jquery'

# Car demo game
class CarDemoGame extends P2Pixi.Game

	constructor: ->
		super(
			pixiOptions:
				view: document.getElementById('viewport')
				transparent: true
			assetUrls: ['assets/textures/rock.jpg']
		)

	# @override
	beforeRun: ->
		new CarGround this

	afterRender: ->
		console.log this
		@afterRender = ->


#
# Ground
#
class CarGround extends P2Pixi.GameObject

	constructor: (game) ->
		super(game)

		bodyOptions =
			collisionGroup: 1
			collisionMask: 1 | 2

		texture = PIXI.Texture.fromImage 'assets/textures/rock.jpg', false
		material = new p2.Material

		body = new p2.Body
			position: [0, 10]
			mass: 0

		@addBody body
		@addShape body, @createHeightField(material), [0, 0], 0, bodyOptions, .5, texture
		this

	# Creates a new height field
	createHeightField: (material) ->
		heights = [1 .. 500].map (i) -> Math.cos(0.2 * i) * Math.sin(0.5 * i) + 0.2 * Math.sin(0.1 * i) * Math.sin(0.05 * i)
		heightField = new p2.Heightfield(
			heights: heights
			elementWidth: 0.3
		)
		heightField.material = material
		heightField



jQuery(document).ready ->
	new CarDemoGame()
