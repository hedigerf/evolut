/**
 * P2Pixi in es6.
 *
 * P2Pixi v0.8.1 - 13-11-2015
 * Copyright (c) Tom W Hall <tomshalls@gmail.com>
 * A simple 2D vector game model framework using p2.js for physics and Pixi.js for rendering.
 * License: MIT
 *
 * @module P2Pixi
 */

/* eslint-env browser */
/* eslint-disable complexity, max-statements, no-magic-numbers  */

import p2 from 'p2';
import PIXI from 'pixi.js';

PIXI.utils._saidHello = true;

/**
 * Resolution of world step.
 *
 * @type {Number}
 */
const WORLD_STEP_TIME = 60;

/**
 * Represents the game world.
 */
export class Game {

  /**
   * Creates a new Game instance
   *
   * @param {Object} options
   */
  constructor(options = {}) {

    options.trackedBodyOffset = options.trackedBodyOffset || [0, 0];
    this.options = options;

    this.world = new p2.World(options.worldOptions || {});
    this.pixiAdapter = new PixiAdapter(options.pixiOptions || {});

    this.gameObjects = [];
    this.trackedBody = null;
    this.paused = false;
    this.lastWorldStepTime = null;
    this.assetsLoaded = false;

    if (options.assetUrls) {
      this.loadAssets(options.assetUrls);
    } else {
      this.assetsLoaded = true;
    }

    this.runIfAssetsLoaded();
  }

  /**
   * Adds the supplied GameObject
   *
   * @param {GameObject} gameObject
   */
  addGameObject(gameObject) {
    this.gameObjects.push(gameObject);
  }

  /**
   * Removes the supplied GameObject
   *
   * @param {GameObject} gameObject
   */
  removeGameObject(gameObject) {
    const index = this.gameObjects.indexOf(gameObject);

    if (index !== -1) {
      gameObject.clear();

      this.gameObjects.splice(index, 1);
    }
  }

  /**
   * Loads the supplied assets asyncronously
   *
   * @param {Array<String>} assetUrls
   */
  loadAssets(assetUrls) {
    const self = this;
    const loader = PIXI.loader;

    for (let i = 0; i < assetUrls.length; i++) {
      loader.add(assetUrls[i], assetUrls[i]);
    }

    loader.once('complete', () => {
      self.assetsLoaded = true;
      self.runIfAssetsLoaded();
    });

    loader.load();
  }

  /**
   * Called before the game loop is started
   */
  beforeRun() {}

  /**
   * Checks if all assets are loaded and if so, runs the game
   */
  runIfAssetsLoaded() {
    if (this.assetsLoaded) {
      this.beforeRun();
      this.run();
    }
  }

  /**
   * Returns the current time in seconds
   *
   * @return {Number}
   */
  time() {
    return new Date().getTime() / 1000;
  }

  /**
   * Begins the world step / render loop
   */
  run() {

    const self = this;
    const maxSubSteps = 10;

    self.lastWorldStepTime = self.time();

    function update() {

      if (!self.paused) {
        const timeSinceLastCall = self.time() - self.lastWorldStepTime;
        self.lastWorldStepTime = self.time();
        self.world.step(1 / WORLD_STEP_TIME, timeSinceLastCall, maxSubSteps);
      }

      self.beforeRender();
      self.render();
      self.afterRender();

      requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  /**
   * Called before rendering
   */
  beforeRender() {
    const trackedBody = this.trackedBody;

    // Focus tracked body, if set
    if (trackedBody !== null) {
      const pixiAdapter = this.pixiAdapter;
      const renderer = pixiAdapter.renderer;
      const ppu = pixiAdapter.pixelsPerLengthUnit;
      const containerPosition = pixiAdapter.container.position;
      const trackedBodyPosition = trackedBody.position;
      const trackedBodyOffset = this.options.trackedBodyOffset;
      const deviceScale = pixiAdapter.deviceScale;

      containerPosition.x =
        ((trackedBodyOffset[0] + 1) * renderer.width * 0.5)
        - (trackedBodyPosition[0] * ppu * deviceScale);
      containerPosition.y =
        ((trackedBodyOffset[1] + 1) * renderer.height * 0.5)
        + (trackedBodyPosition[1] * ppu * deviceScale);
    }
  }

  /**
   * Updates the Pixi representation of the world
   */
  render() {

    const pixiAdapter = this.pixiAdapter;
    const ppu = pixiAdapter.pixelsPerLengthUnit;
    const gameObjects = this.gameObjects;
    const gameObjectCount = gameObjects.length;

    for (let i = 0; i < gameObjectCount; i++) {
      const gameObject = gameObjects[i];
      const gameObjectBodyCount = gameObject.bodies.length;

      // Update Container transforms
      for (let j = 0; j < gameObjectBodyCount; j++) {
        const body = gameObject.bodies[j];
        const container = gameObject.containers[j];

        container.position.x = body.position[0] * ppu;
        container.position.y = -body.position[1] * ppu;
        container.rotation = -body.angle;
      }
    }

    pixiAdapter.renderer.render(pixiAdapter.stage);
  }

  /**
   * Called after rendering
   */
  afterRender() {}

  /**
   * Removes all GameObjects
   */
  clear() {
    while (this.gameObjects.length > 0) {
      this.removeGameObject(this.gameObjects[0]);
    }
  }

  /**
   * Toggles pause state
   */
  pauseToggle() {
    this.paused = !this.paused;

    if (!this.paused) {
      this.lastWorldStepTime = this.time();
    }
  }

}

/**
 * Represents an object wihtin a game world.
 */
export class GameObject {

  /**
   * Creates a new GameObject instance
   * @param {Game} game
   */
  constructor(game) {
    this.game = game;

    // P2 physics bodies
    this.bodies = [];
    this.constraints = [];

    this.constraints = [];
    // Pixi Containers, one for each body.
    // Each contains a child array of Graphics and / or Sprites.
    this.containers = [];

    game.addGameObject(this);
  }

  /**
   * Adds the supplied p2 body to the game's world and creates a corresponding null Container object for rendering.
   * Also adds the body to this GameObject's bodies collection
   * @param {Body} body
   * @return {GameObject} gameObject
   */
  addBody(body) {
    const container = new PIXI.Container();

    this.bodies.push(body);
    this.game.world.addBody(body);

    this.containers.push(container);
    this.game.pixiAdapter.container.addChild(container);

    return this;
  }

  /**
   * Adds the supplied p2 shape to the supplied p2 body
   * @param {Body} body
   * @param {Shape} shape
   * @param {Vector} offset
   * @param {Number} angle
   * @param {Object} options
   * @param {Object} style
   * @param {Texture} texture
   * @param {Number} alpha
   * @param {Object} textureOptions
   * @return {GameObject} gameObject
   */
  addShape(body, shape, offset = [0, 0], angle = 0, options = {}, style, texture, alpha, textureOptions) {

    shape.collisionGroup = options.collisionGroup || 1;
    shape.collisionMask = options.collisionMask || 1;

    body.addShape(shape, offset, angle);

    const container = this.containers[this.bodies.indexOf(body)];

    this.game.pixiAdapter.addShape(container, shape, offset, angle, style, texture, alpha, textureOptions);

    return this;
  }

  /**
   * Adds the supplied p2 constraint to the game's world and to this GameObject's constraints collection
   * @param {Constraint} constraint
   * @return {GameObject} gameObject
   */
  addConstraint(constraint) {

    this.constraints.push(constraint);
    this.game.world.addConstraint(constraint);

    return this;
  }

  /**
   * Clears bodies, Containers and constraints. Called when the GameObject is removed from the game
   */
  clear() {
    const game = this.game;
    const world = game.world;
    const container = game.pixiAdapter.container;

    // Remove p2 constraints from the world
    for (let i = 0; i < this.constraints.length; i++) {
      world.removeConstraint(this.constraints[i]);
    }

    // Remove p2 bodies from the world and Pixi Containers from the stage
    for (let i = 0; i < this.bodies.length; i++) {
      world.removeBody(this.bodies[i]);
      container.removeChild(this.containers[i]);
    }
  }

}

/**
 * Represents an adapter for pixi.js.
 */
export class PixiAdapter extends p2.EventEmitter {

  constructor(options = {}) {
    super();

    const settings = {
      pixelsPerLengthUnit: 128,
      width: 1280,
      height: 720,
      transparent: false,
      antialias: true,
      useDeviceAspect: false,
      webGLEnabled: true,
      useDevicePixels: true
    };

    for (const key in options) {
      settings[key] = options[key];
    }

    if (settings.useDeviceAspect) {
      settings.height = (window.innerHeight / window.innerWidth) * settings.width;
    }

    this.settings = settings;
    this.pixelsPerLengthUnit = settings.pixelsPerLengthUnit;
    this.stage = new PIXI.Container();
    this.container = new PIXI.Container();
    this.stage.addChild(this.container);

    this.setDeviceProperties();
    this.setupRenderer();
    this.setupView();
  }

  /**
   * Reads and stores device properties
   */
  setDeviceProperties() {
    const settings = this.settings;

    this.devicePixelRatio = settings.useDevicePixels ? (window.devicePixelRatio || 1) : 1;
    this.deviceScale = this.devicePixelRatio !== 1
      ? (Math.round(Math.max(screen.width, screen.height) * this.devicePixelRatio)
        / Math.max(settings.width, settings.height))
      : 1;
  }

  /**
   * Sets up the Pixi renderer
   */
  setupRenderer() {
    const settings = this.settings;
    const deviceScale = this.deviceScale;

    this.renderer = settings.webGLEnabled
        ? PIXI.autoDetectRenderer(settings.width * deviceScale, settings.height * deviceScale, settings)
        : new PIXI.CanvasRenderer(settings.width * deviceScale, settings.height * deviceScale, settings);
  }

  /**
   * Sets up the Pixi view
   */
  setupView() {
    const self = this;
    const renderer = this.renderer;
    const view = this.renderer.view;
    const container = this.container;
    const deviceScale = this.deviceScale;

    view.style.position = 'absolute';

    document.body.appendChild(this.renderer.view);

    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;

    container.position.x = renderer.width / 2;
    container.position.y = renderer.height / 2;

    container.scale.x = deviceScale;
    container.scale.y = deviceScale;

    this.viewCssWidth = 0;
    this.viewCssHeight = 0;
    this.resize(this.windowWidth, this.windowHeight);


    function resizeRenderer() {
      self.resize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener('resize', resizeRenderer);
    window.addEventListener('orientationchange', resizeRenderer);
  }


  /**
   * Draws a circle onto a PIXI.Graphics object
   * @param {PIXI.Graphics} graphics
   * @param {Number} x
   * @param {Number} y
   * @param {Number} radius
   * @param {Object} style
   */
  drawCircle(graphics, x, y, radius, style = {}) {

    const lineWidth = style.lineWidthUnits
      ? style.lineWidthUnits * this.pixelsPerLengthUnit
      : style.lineWidth || 0;
    const lineColor = style.lineColor || 0x000000;
    const fillColor = style.fillColor;

    graphics.lineStyle(lineWidth, lineColor, 1);

    if (fillColor) {
      graphics.beginFill(fillColor, 1);
    }

    graphics.drawCircle(x, y, radius);

    if (fillColor) {
      graphics.endFill();
    }
  }

  /**
   * Draws a finite plane onto a PIXI.Graphics object
   * @param {Graphics} graphics
   * @param {Number} x0
   * @param {Number} x1
   * @param {Object} style
   */
  drawPlane(graphics, x0, x1, style = {}) {

    const max = 1e6;
    const lineWidth = style.lineWidthUnits
      ? style.lineWidthUnits * this.pixelsPerLengthUnit
      : style.lineWidth || 0;
    const lineColor = style.lineColor || 0x000000;
    const fillColor = style.fillColor;

    graphics.lineStyle(lineWidth, lineColor, 1);

    if (fillColor) {
      graphics.beginFill(fillColor, 1);
    }

    graphics.moveTo(-max, 0);
    graphics.lineTo(max, 0);
    graphics.lineTo(max, max);
    graphics.lineTo(-max, max);

    if (fillColor) {
      graphics.endFill();
    }

    // Draw the actual plane
    graphics.lineStyle(lineWidth, lineColor);
    graphics.moveTo(-max, 0);
    graphics.lineTo(max, 0);
  }

  /**
   * Draws a line onto a PIXI.Graphics object.
   *
   * @param {Graphics} graphics
   * @param {Number} len
   * @param {Object} style
   */
  drawLine(graphics, len, style = {}) {

    const lineWidth = style.lineWidthUnits
      ? style.lineWidthUnits * this.pixelsPerLengthUnit
      : style.lineWidth || 1;
    const lineColor = style.lineColor || 0x000000;

    graphics.lineStyle(lineWidth, lineColor, 1);

    graphics.moveTo(-len / 2, 0);
    graphics.lineTo(len / 2, 0);
  }


  drawRay(graphics, from, to, style = {}) {

    const lineWidth = style.lineWidthUnits
      ? style.lineWidthUnits * this.pixelsPerLengthUnit
      : style.lineWidth || 1;
    const lineColor = style.lineColor || 0x000000;

    graphics.lineStyle(lineWidth, lineColor, 1);

    graphics.moveTo(from);
    graphics.lineTo(to);
  }

  /**
   * Draws a capsule onto a PIXI.Graphics object.
   *
   * @param {Graphics} graphics
   * @param {Number} x
   * @param {Number} y
   * @param {Number} angle
   * @param {Number} len
   * @param {Number} radius
   * @param {Object} style
   */
  drawCapsule(graphics, x, y, angle, len, radius, style = {}) {

    const  c = Math.cos(angle);
    const  s = Math.sin(angle);
    const lineWidth = style.lineWidthUnits
      ? style.lineWidthUnits * this.pixelsPerLengthUnit
      : style.lineWidth || 0;
    const lineColor = style.lineColor || 0x000000;
    const fillColor = style.fillColor;

    graphics.lineStyle(lineWidth, lineColor, 1);

    // Draw circles at ends
    if (fillColor) {
      graphics.beginFill(fillColor, 1);
    }

    graphics.drawCircle(-len / 2 * c + x, -len / 2 * s + y, radius);
    graphics.drawCircle(len / 2 * c + x, len / 2 * s + y, radius);

    if (fillColor) {
      graphics.endFill();
    }

    // Draw box
    graphics.lineStyle(lineWidth, lineColor, 0);

    if (fillColor) {
      graphics.beginFill(fillColor, 1);
    }

    graphics.moveTo(-len / 2 * c + radius * s + x, -len / 2 * s + radius * c + y);
    graphics.lineTo(len / 2 * c + radius * s + x, len / 2 * s + radius * c + y);
    graphics.lineTo(len / 2 * c - radius * s + x, len / 2 * s - radius * c + y);
    graphics.lineTo(-len / 2 * c - radius * s + x, -len / 2 * s - radius * c + y);

    if (fillColor) {
      graphics.endFill();
    }

    // Draw lines in between
    graphics.lineStyle(lineWidth, lineColor, 1);
    graphics.moveTo(-len / 2 * c + radius * s + x, -len / 2 * s + radius * c + y);
    graphics.lineTo(len / 2 * c + radius * s + x, len / 2 * s + radius * c + y);
    graphics.moveTo(-len / 2 * c - radius * s + x, -len / 2 * s - radius * c + y);
    graphics.lineTo(len / 2 * c - radius * s + x, len / 2 * s - radius * c + y);
  }

  /**
   * Draws a box onto a PIXI.Graphics object
   * @param {Graphics} graphics
   * @param {Number} x
   * @param {Number} y
   * @param {Number} w
   * @param {Number} h
   * @param {Object} style
   */
  drawRectangle(graphics, x, y, w, h, style = {}) {

    const  lineWidth = style.lineWidthUnits
      ? style.lineWidthUnits * this.pixelsPerLengthUnit
      : style.lineWidth || 0;
    const lineColor = style.lineColor || 0x000000;
    const fillColor = style.fillColor;

    graphics.lineStyle(lineWidth, lineColor, 1);

    if (fillColor) {
      graphics.beginFill(fillColor, 1);
    }

    graphics.drawRect(x - w / 2, y - h / 2, w, h);

    if (fillColor) {
      graphics.endFill();
    }
  }

  /**
   * Draws a convex polygon onto a PIXI.Graphics object
   * @param {Graphics} graphics
   * @param {Array} verts
   * @param {Object} style
   */
  drawConvex(graphics, verts, style = {}) {

    const lineWidth = style.lineWidthUnits
      ? style.lineWidthUnits * this.pixelsPerLengthUnit
      : style.lineWidth || 0;
    const lineColor = style.lineColor || 0x000000;
    const fillColor = style.fillColor;

    graphics.lineStyle(lineWidth, lineColor, 1);

    if (fillColor) {
      graphics.beginFill(fillColor, 1);
    }

    for (let i = 0; i !== verts.length; i++) {

      const  v = verts[i];
      const x = v[0];
      const y = v[1];

      if (i === 0) {
        graphics.moveTo(x, y);
      } else {
        graphics.lineTo(x, y);
      }
    }

    if (fillColor) {
      graphics.endFill();
    }

    if (verts.length > 2 && lineWidth !== 0) {
      graphics.moveTo(verts[verts.length - 1][0], verts[verts.length - 1][1]);
      graphics.lineTo(verts[0][0], verts[0][1]);
    }
  }

  /**
   * Draws a path onto a PIXI.Graphics object
   * @param {Graphics} graphics
   * @param {Array} path
   * @param {Object} style
   */
  drawPath(graphics, path, style = {}) {

    const lineWidth = style.lineWidthUnits
      ? style.lineWidthUnits * this.pixelsPerLengthUnit
      : style.lineWidth || 0;
    const lineColor = style.lineColor || 0x000000;
    const fillColor = style.fillColor;

    graphics.lineStyle(lineWidth, lineColor, 1);

    if (fillColor) {
      graphics.beginFill(fillColor, 1);
    }

    let lastx = null;
    let lasty = null;

    for (let i = 0; i < path.length; i++) {

      const v = path[i];
      const x = v[0];
      const y = v[1];

      if (x !== lastx || y !== lasty) {
        if (i === 0) {
          graphics.moveTo(x, y);
        } else {
          // Check if the lines are parallel
          const p1x = lastx;
          const p1y = lasty;
          const p2x = x;
          const p2y = y;
          const p3x = path[(i + 1) % path.length][0];
          const p3y = path[(i + 1) % path.length][1];
          const area = ((p2x - p1x) * (p3y - p1y)) - ((p3x - p1x) * (p2y - p1y));

          if (area !== 0) {
            graphics.lineTo(x, y);
          }
        }

        lastx = x;
        lasty = y;
      }
    }

    if (fillColor) {
      graphics.endFill();
    }

    // Close the path
    if (path.length > 2 && style.fillColor) {
      graphics.moveTo(path[path.length - 1][0], path[path.length - 1][1]);
      graphics.lineTo(path[0][0], path[0][1]);
    }
  }

  /**
   * Renders the supplied p2 Shape onto the supplied Pixi Graphics object using the supplied Pixi style properties
   * @param {Graphics} graphics
   * @param {Shape} shape
   * @param {Vector} offset
   * @param {Number} angle
   * @param {Object} style
   */
  renderShapeToGraphics(graphics, shape, offset = [0, 0], angle = 0, style) {

    const ppu = this.pixelsPerLengthUnit;

    if (shape instanceof p2.Circle) {
      this.drawCircle(graphics, offset[0] * ppu, -offset[1] * ppu, shape.radius * ppu, style);

    } else if (shape instanceof p2.Particle) {
      this.drawCircle(graphics, offset[0] * ppu, -offset[1] * ppu, 2 * style.lineWidth, style);

    } else if (shape instanceof p2.Plane) {
      // TODO: use shape angle
      this.drawPlane(graphics, -10 * ppu, 10 * ppu, style);

    } else if (shape instanceof p2.Line) {
      this.drawLine(graphics, shape.length * ppu, style);

    } else if (shape instanceof p2.Ray) {
      this.drawRay(graphics, shape.from * ppu, shape.to * ppu, style);
    } else if (shape instanceof p2.Box) {
      this.drawRectangle(graphics, offset[0] * ppu, -offset[1] * ppu, shape.width * ppu, shape.height * ppu, style);
    } else if (shape instanceof p2.Capsule) {
      this.drawCapsule(graphics,
        offset[0] * ppu,
        -offset[1] * ppu,
        angle,
        shape.length * ppu,
        shape.radius * ppu,
        style
      );

    } else if (shape instanceof p2.Convex) {
      // Scale verts
      const verts = [];
      const vrot = p2.vec2.create();

      for (let i = 0; i < shape.vertices.length; i++) {
        const v = shape.vertices[i];
        p2.vec2.rotate(vrot, v, angle);
        verts.push([(vrot[0] + offset[0]) * ppu, -(vrot[1] + offset[1]) * ppu]);
      }

      this.drawConvex(graphics, verts, style);
    } else if (shape instanceof p2.Heightfield) {
      const path = [[0, 100 * ppu]];
      const heights = shape.heights;

      for (let i = 0; i < heights.length; i++) {
        const v = heights[i];
        path.push([i * shape.elementWidth * ppu, -v * ppu]);
      }

      path.push([heights.length * shape.elementWidth * ppu, 100 * ppu]);
      this.drawPath(graphics, path, style);
    }
  }

  /**
   * Adds the supplied shape to the supplied Container, using vectors and / or a texture
   *
   * @param {Container} container
   * @param {Shape} shape
   * @param {Vector} offset
   * @param {Number} angle
   * @param {Object} style
   * @param {Texture} texture
   * @param {Number} alpha
   * @param {Object} textureOptions
   */
  addShape(container, shape, offset, angle, style, texture, alpha, textureOptions = {}) {

    const zero = [0, 0];
    let sprite;
    const ppu = this.pixelsPerLengthUnit;

    // If a Pixi texture has been specified...
    if (texture) {
      // Calculate the bounding box of the shape when at zero offset and 0 angle
      const aabb = new p2.AABB();
      shape.computeAABB(aabb, zero, 0);

      // Get world coordinates of shape boundaries
      const left = aabb.lowerBound[0];
      let bottom = aabb.lowerBound[1];
      const right = aabb.upperBound[0];
      const top = aabb.upperBound[1];

      // Cater for Heightfield shapes
      if (shape instanceof p2.Heightfield) {
        bottom = -(this.settings.height / ppu);
      }

      const width = right - left;
      const height = top - bottom;

      // Create a Sprite or TilingSprite to cover the entire shape
      if (textureOptions.tile === false) {
        sprite = new PIXI.Sprite(texture);
      } else {
        sprite = new PIXI.extras.TilingSprite(texture, width * ppu, height * ppu);
      }

      sprite.alpha = alpha || 1;

      // If the shape is anything other than a box, we need a mask for the texture.
      // We use the shape itself to create a new Graphics object.
      if (!(shape instanceof p2.Box)) {
        const maskGraphics = new PIXI.Graphics();
        maskGraphics.renderable = false;
        maskGraphics.position.x = (offset[0] * ppu);
        maskGraphics.position.y = -(offset[1] * ppu);
        maskGraphics.rotation = -angle;

        this.renderShapeToGraphics(maskGraphics, shape, zero, 0, { lineWidth: 0, fillColor: 0xffffff });

        container.addChild(maskGraphics);
        sprite.mask = maskGraphics;
      }

      // Sprite positions are the top-left corner of the Sprite, whereas Graphics objects
      // are positioned at their origin
      if (angle === 0) {
        sprite.position.x = (left * ppu) + (offset[0] * ppu);
        sprite.position.y = -(top * ppu) - (offset[1] * ppu);
        sprite.rotation = -angle;

        container.addChild(sprite);
      } else {
        sprite.position.x = (left * ppu);
        sprite.position.y = -(top * ppu);

        const doc = new PIXI.Container();
        doc.addChild(sprite);
        doc.position.x = (offset[0] * ppu);
        doc.position.y = -(offset[1] * ppu);
        doc.rotation = -angle;

        doc.addChild(sprite);
        container.addChild(doc);
      }
    }

    // If any Pixi vector styles have been specified...
    if (style) {
      const graphics = new PIXI.Graphics();
      graphics.alpha = alpha || 1;
      graphics.position.x = (offset[0] * ppu);
      graphics.position.y = -(offset[1] * ppu);
      graphics.rotation = -angle;

      this.renderShapeToGraphics(graphics, shape, zero, 0, style);

      container.addChild(graphics);
    }
  }

  /**
   * Resizes the Pixi renderer's view to fit proportionally in the supplied window dimensions.
   *
   * @param {Number} w
   * @param {Number} h
   */
  resize(w, h) {

    const renderer = this.renderer;
    const view = renderer.view;
    const ratio = w / h;
    const pixiRatio = renderer.width / renderer.height;

    this.windowWidth = w;
    this.windowHeight = h;

    if (ratio > pixiRatio) { // Screen is wider than the renderer

      this.viewCssWidth = h * pixiRatio;
      this.viewCssHeight = h;

      view.style.width = this.viewCssWidth + 'px';
      view.style.height = this.viewCssHeight + 'px';

      view.style.left = Math.round((w - this.viewCssWidth) / 2) + 'px';
      view.style.top = null;

    } else { // Screen is narrower

      this.viewCssWidth = w;
      this.viewCssHeight = Math.round(w / pixiRatio);

      view.style.width = this.viewCssWidth + 'px';
      view.style.height = this.viewCssHeight + 'px';

      view.style.left = null;
      view.style.top = Math.round((h - this.viewCssHeight) / 2) + 'px';
    }
  }

}
