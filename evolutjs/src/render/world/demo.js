'use strict';

import path from 'path';
import P2Pixi from './../../../lib/p2Pixi';

import CarGround from '../object/demoGround';
import Circle from '../object/demoCircle';

function rockTexturePath() {
  return path.join(__dirname, '../../..', 'assets/textures', 'rock.jpg');
}

export default class CarDemoGame extends P2Pixi.Game {

  constructor() {
    super({
      pixiOptions: {
        view: document.getElementById('viewport'),
        transparent: true,
        autoResize: true
      },
      assetUrls: [rockTexturePath()]
    });
  }

  beforeRun() {

    new CarGround(this);
    const circle = new Circle(this);

    for (let i = 0; i < 200; i++) {
      new Circle(this);
    }

    this.trackedBody = circle.bodies[0];
  }

}
