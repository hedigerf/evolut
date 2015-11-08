console.log('hallo');

var jQuery = require('jquery');
var PIXI = require('pixi.js');

jQuery(document).ready(function() {

    console.log('rdy start');

    var Matter = require('matter-js');

    // Matter.js module aliases
    var Engine = Matter.Engine,
        World = Matter.World,
        Bodies = Matter.Bodies;

    // create a Matter.js engine
    //var engine = Engine.create(document.body);
    var engine = Engine.create({
        render: {
            element: document.body,
            controller: Matter.RenderPixi
        }
    });

    // create two boxes and a ground
    var boxA = Bodies.rectangle(400, 200, 80, 80);
    var boxB = Bodies.rectangle(450, 50, 80, 80);
    var ground = Bodies.rectangle(400, 610, 810, 60, {
        isStatic: true
    });

    // add all of the bodies to the world
    World.add(engine.world, [boxA, boxB, ground]);

    // run the engine
    Engine.run(engine);

    console.log('rdy done');

});

console.log('eof');
