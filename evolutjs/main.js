/**
 * This is the application entry point.
 * Ensures that all es2015 sources are transpiled.
 * And then starts the application.
 *
 * @module main
 */

require('babel-register');
require('./src/app/app.js');
