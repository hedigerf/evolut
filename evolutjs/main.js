require('crash-reporter').start();
//var appRoot = '/home/hedigerf/GitReps/evolut/evolutjs';
//require('electron-compile').init(appRoot,'./main');
require('babel-register');
require('./app.js');
