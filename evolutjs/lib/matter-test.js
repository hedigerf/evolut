var jQuery = require('jquery');
var PIXI = require('pixi.js');
var Matter = require('matter-js');

jQuery(document).ready(function() {

    var Engine = Matter.Engine,
        World = Matter.World,
        Bodies = Matter.Bodies;

    var engine = Engine.create({
        render: {
            element: document.body,
            controller: Matter.RenderPixi
        }
    });

    var boxA = Bodies.rectangle(400, 200, 80, 80);
    var boxB = Bodies.rectangle(450, 50, 80, 80);
    var boxC = Bodies.rectangle(350, 150, 40, 40);
    var ground = Bodies.rectangle(400, 610, 810, 60, {
        isStatic: true
    });

    World.add(engine.world, [boxA, boxB, boxC, ground]);
    Engine.run(engine);
});
