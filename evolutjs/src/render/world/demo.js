'use strict';

let path = require('path');

let P2Pixi = require('./../../../lib/p2Pixi');

let CarGround = require('../object/demoGround');
let Circle = require('../object/demoCircle');

let rockTexturePath = () => {
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

      new CarGround(this);
      let circle = new Circle(this);

      for (var i = 0; i < 200; i++) {
        new Circle(this);
      }

      this.trackedBody = circle.bodies[0];
    }
  };
