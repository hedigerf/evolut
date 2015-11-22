PIXI = require 'pixi.js'
p2 = require 'p2'
P2Pixi = require './../../../lib/p2Pixi.js'

makeLeg = (x, y) ->
  new p2.Body
    mass: .5
    position: [x, y]

makeLegShape = (width, height) ->
  new p2.Box
    width: width || .25
    height: height || .5

makeLegJoint = (lowerLeg, upperLeg, legLength) ->
  constraint = new p2.RevoluteConstraint lowerLeg, upperLeg,
    localPivotA: [0, legLength / 2],
    localPivotB: [0, -legLength / 2]

  constraint.setLimits -Math.PI / 8, Math.PI / 8
  constraint

makeHipJoint = (body, leg, legLength, distance, bodyLength) ->
  constraint = new p2.RevoluteConstraint leg, body,
    localPivotA: [0, legLength / 2]
    localPivotB: [-distance / 2, -bodyLength / 2]

class Ant extends P2Pixi.GameObject

  constructor: (game) ->
    super game

    bodyOptions =
      collisionGroup: 3
      collisionMask: 1

    x = 1
    y = 10

    body = new p2.Body
      position: [x, y]
      mass: 2

    # body
    vertices = [[0, 0], [2, 0], [0, 1], [-2, 0]]
    convex = new p2.Convex vertices: vertices

    # legs
    legLength = .5

    frontLegX = 1.75
    rearLegX = .25

    upperLegY = y - legLength / 2
    lowerLegY = y - upperLegY - legLength / 2

    leftUpper1 = makeLeg frontLegX, upperLegY
    leftLower1 = makeLeg frontLegX, lowerLegY

    leftUpper2 = makeLeg rearLegX, upperLegY
    leftLower2 = makeLeg rearLegX, lowerLegY

    rightUpper1 = makeLeg frontLegX, upperLegY
    rightLower1 = makeLeg frontLegX, lowerLegY

    rightUpper2 = makeLeg rearLegX, upperLegY
    rightLower2 = makeLeg rearLegX, lowerLegY

    style =
      lineWidth: 1
      lineColor: 0x0000ff
      fillColor: 0x00ffff

    @addBody body
    @addShape body, convex, [0, 0], 0, bodyOptions, style

    @addBody leftUpper1
    @addBody leftLower1
    @addBody leftUpper2
    @addBody leftLower2
    @addBody rightUpper1
    @addBody rightLower1
    @addBody rightUpper2
    @addBody rightLower2

    @addShape leftUpper1, makeLegShape(), [0, 0], 0, bodyOptions, style
    @addShape leftLower1, makeLegShape(), [0, 0], 0, bodyOptions, style
    @addShape leftUpper2, makeLegShape(), [0, 0], 0, bodyOptions, style
    @addShape leftLower2, makeLegShape(), [0, 0], 0, bodyOptions, style
    @addShape rightUpper1, makeLegShape(), [0, 0], 0, bodyOptions, style
    @addShape rightLower1, makeLegShape(), [0, 0], 0, bodyOptions, style
    @addShape rightUpper2, makeLegShape(), [0, 0], 0, bodyOptions, style
    @addShape rightLower2, makeLegShape(), [0, 0], 0, bodyOptions, style

    @addConstraint makeLegJoint leftLower1, leftUpper1, legLength
    @addConstraint makeLegJoint leftLower2, leftUpper2, legLength
    @addConstraint makeLegJoint rightLower1, rightUpper1, legLength
    @addConstraint makeLegJoint rightLower2, rightUpper2, legLength

    @addConstraint makeHipJoint body, leftUpper1, legLength, .25, 2
    @addConstraint makeHipJoint body, leftUpper2, legLength, .25, 2
    @addConstraint makeHipJoint body, rightUpper1, legLength, .25, 2
    @addConstraint makeHipJoint body, rightUpper2, legLength, .25, 2

root = exports ? this
root.Ant = Ant
