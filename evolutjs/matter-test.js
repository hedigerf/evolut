import 'jquery';
import 'pixi.js';
import 'matter-js';

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
    let ground = Bodies.rectangle(400, 610, 810, 60, {
        isStatic: true
    });

    World.add(engine.world, [boxA, boxB, ground]);
    Engine.run(engine);

});
