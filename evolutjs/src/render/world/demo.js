'use strict';

let path = require('path');
let Random = require('random-js');

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

      let ground = new CarGround(this);
      let circle = new Circle(this);

      let self = this;

      ((() => {
        let result = [];
        let i = 0;
        while (i <= 200) {
          result.push(i++);
        }
        return result;
      })()).forEach( () => {
        return new Circle(self);
        }
        );

      return this.trackedBody = circle.bodies[0];
    }
  };
