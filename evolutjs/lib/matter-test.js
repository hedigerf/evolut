var jQuery = require('jquery');
var PIXI = require('pixi.js');
var Matter = require('matter-js');


jQuery(document).ready(() => {

    var Engine = Matter.Engine,
        World = Matter.World,
        Bodies = Matter.Bodies,
        Body = Matter.Body,
        Events = Matter.Events,
        Constraint = Matter.Constraint;

    var engine = Engine.create({
        render: {
            element: document.body,
            controller: Matter.RenderPixi
        }
    });

    // create two boxes and a ground
    //var boxA = Bodies.rectangle(400, 200, 80, 80);
    //var boxB = Bodies.rectangle(450, 50, 80, 80);
    var boxC = Bodies.rectangle(300,510,200,50);
    var leg = Bodies.rectangle(300,560,10,50);
    var leg2 = Bodies.rectangle(350,560,10,50);
    var leg3 = Bodies.rectangle(250,560,10,50);
    var constraint=Constraint.create({bodyA: boxC, bodyB: leg, pointA: {x: 0, y: 50}});
    var constraint2=Constraint.create({bodyA: boxC, bodyB: leg2, pointA: {x: 50, y: 50}});
    var constraint3=Constraint.create({bodyA: boxC, bodyB: leg3, pointA: {x: -50, y: 50 }});

    var ground = Bodies.rectangle(400, 610, 810, 60, {
        isStatic: true
    });

    // add all of the bodies to the world
    World.add(engine.world, [boxC, leg,constraint,leg2,constraint2,leg3,constraint3,ground]);

    Events.on(engine, "tick",  event => {
      console.log("tick" + event.timestamp);
      Body.translate(leg,{ x: 1, y: 0 } ); //move body relative to position
      Body.translate(leg2,{ x: 1, y: 0 } ); //move body relative to position
      Body.translate(leg3,{ x: 1, y: 0 } ); //move body relative to position
    });

    Events.on(engine, "collisionStart",  event => {
      var collisionIncList=event.pairs;
      console.log("collision is about to start");
    });
    // run the engine
    Engine.run(engine);
});
