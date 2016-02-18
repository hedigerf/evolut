'use strict';

var p2 = require('p2');
var Random = (require('random-js'))();

var P2Pixi = require('./../../../lib/p2Pixi');

var randomPosition = function() {
  return [Random.integer(0, 20), Random.integer(15, 25)];
};

var randomColor = function() {
  return parseInt((Random.hex(6)), 16);
};

module.exports =
  class Circle extends P2Pixi.GameObject {

    constructor(game) {
      super(game);

      var bodyOptions =
        {collisionGroup: Random.integer(2, 20),
        collisionMask: 1
        };

      var body = new p2.Body({
        position: randomPosition(),
        mass: Random.integer(2, 200)
      });

      var circle = new p2.Circle({
        radius: 0.25
      });

      var style =
        {lineWidth: 1,
        lineColor: randomColor(),
        fillColor: randomColor()
        };

      this.addBody(body);
      this.addShape(body, circle, [0, 0], 0, bodyOptions, style);
    }
  };
