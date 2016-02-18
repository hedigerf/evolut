'use strict';

let p2 = require('p2');
let path = require('path');
let PIXI = require('pixi.js');

let P2Pixi = require('./../../../lib/p2Pixi');

let cosAmp = (x, amp) => {
  return Math.cos(x * amp);
};

let toHeight = (i) => {
  let cos = (a) => {
    return cosAmp(i, a);
  };
  return cos(0.2) * cos(0.5) * cos(0.1) * cos(0.05);
};

let rockTexturePath = () => {
  return path.join(__dirname, '../../..', 'assets/textures', 'rock.jpg');
};

// Creates a new height field
let createHeightField = () => {
  return new p2.Heightfield({
    heights: ((() => {
      let result = [];
      let i = 1;
      while (i <= 500) {
        result.push(i++);
      }
      return result;
    })()).map( toHeight
      ),
    elementWidth: 0.3,
    material: new p2.Material()
  });
};

module.exports =

  class CarGround extends P2Pixi.GameObject {

    constructor(game) {
      super(game);

      let bodyOptions =
        {collisionGroup: 1,
        collisionMask: 1 | 2
        };

      let texture = PIXI.Texture.fromImage(rockTexturePath(), false);

      let body = new p2.Body({
        position: [-75, -10],
        mass: 0
      });

      this.addBody(body);
      this.addShape(body, createHeightField(), [0, 0], 0, bodyOptions, null, texture);
    }
  };
