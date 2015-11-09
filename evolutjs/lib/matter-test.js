import * as PIXI from 'pixi.js';
import jQuery from 'jquery';
import Matter, {
    Bodies, Engine, World
}
from 'matter-js';

jQuery(document).ready(() => {

    //let engine = Engine.create(document.body);
    let engine = Engine.create({
        render: {
            element: document.body,
            controller: Matter.RenderPixi
        }
    });

    let boxA = Bodies.rectangle(400, 200, 80, 80);
    let boxB = Bodies.rectangle(450, 50, 80, 80);
    let box3 = Bodies.rectangle(350, 150, 40, 40);

    let ground = Bodies.rectangle(400, 610, 810, 60, {
        isStatic: true
    });

    World.add(engine.world, [boxA, boxB, box3, ground]);
    Engine.run(engine);

});
