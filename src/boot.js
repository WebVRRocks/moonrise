require('./utils/monkey-patch');

var Moonrise = require('./moonrise.js');

var moonrise = new Moonrise();

moonrise.start();

window.moonrise = moonrise;
