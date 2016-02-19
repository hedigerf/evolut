const crashReporter = require('electron').crashReporter;
crashReporter.start({
  productName: 'evolut',
  companyName: 'evolut',
  submitURL: 'https://github.com/hedigerf/evolut/issues',
  autoSubmit: false
});

require('babel-register');
require('./app.js');
