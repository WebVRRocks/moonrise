require('./utils/monkey-patch');

const Moonrise = require('./moonrise.js');

const moonrise = new Moonrise();

moonrise.start();

window.moonrise = moonrise;
