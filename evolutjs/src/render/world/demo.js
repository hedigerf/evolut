'use strict';

var path = require('path');
var Random = require('random-js');

var P2Pixi = require('./../../../lib/p2Pixi');

var CarGround = require('../object/demoGround');
var Circle = require('../object/demoCircle');

var rockTexturePath = function() {
  return path.join(__dirname, '../../..', 'assets/textures', 'rock.jpg');
};


module.exports =

  class CarDemoGame extends P2Pixi.Game {

    constructor() {
      super(
        {pixiOptions:
          {view: document.getElementById('viewport'),
          transparent: true,
          autoResize: true
          },
        assetUrls: [rockTexturePath()]}
        );
    }

    beforeRun() {

      var ground = new CarGround(this);
      var circle = new Circle(this);

      var self = this;

      ((function() {
        var result = [];
        var i = 0;
        while (i <= 200) {
          result.push(i++);
        }
        return result;
      })()).forEach( function() {
        return new Circle(self);
        }
        );

      return this.trackedBody = circle.bodies[0];
    }
  };
