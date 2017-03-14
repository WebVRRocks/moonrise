const app = require('electron').remote.app;

const React = require('react');
const ReactDOM = require('react-dom');
const vapor = require('vapor');

const Loader = require('./components/misc/Loader.js');
const Login = require('./components/login/Login.js');

const updateChecker = require('./utils/update-checker.js');
const Storage = require('./utils/storage.js');
const Logger = require('./utils/logger.js')('moonrise');
const plugins = require('./plugins');

function Moonrise () {
  this.client = vapor();
}

Moonrise.prototype.start = function () {
  var self = this;

  Logger.info('Starting %s v%s', app.getName(), app.getVersion());

  updateChecker();

  Storage.get({fileName: 'user.json'}, function (err, data) {
    let appEl = document.getElementById('app');

    if (err) {
      // Assume the file does not exist.
      ReactDOM.render(<Login />, appEl);
      return;
    }

    try {
      var user = JSON.parse(data);
    } catch (e) {
      // Ignore the data.
      ReactDOM.render(<Login />, appEl);
      return;
    }

    // Explicitly set this option.
    user.rememberPassword = true;

    ReactDOM.render(<Loader message="Connecting…"/>, appEl);

    self.init(user, function () {
      self.loadPlugins();
      self.connect();
    });
  });
};

Moonrise.prototype.init = function (options, next) {
  var self = this;
  var sanitizedUsername = options.username.toLowerCase();

  // Set `logonID` to something unique.
  // Official client obfuscates private IP address, but we probably don't want this.
  options.logonID = Math.floor(new Date() / 1000);

  Storage.get({prefix: sanitizedUsername, fileName: 'servers.json'}, function (err, data) {
    if (err) {
      Logger.warn('Failed to load server list from cache. Falling back to built-in cache…');
    } else {
      var servers;
      try {
        servers = JSON.parse(data);
      } catch (e) {
        // ignore
      }

      if (servers) {
        self.client.servers = servers;
      }
    }

    self.client.init(options);

    if (typeof next === 'function') {
      next();
    }
  });
};

Moonrise.prototype.loadPlugins = function () {
  // Load these 3 plugins ASAP (order matters).
  this.client.use(plugins.logger);
  this.client.use(plugins.essentials);
  this.client.use(plugins.file);

  this.client.use(plugins.chatLogger);
  this.client.use(plugins.steamGuard);
  this.client.use(plugins.ready);
  this.client.use(plugins.personaState);
  this.client.use(plugins.friendMsg);
  this.client.use(plugins.loginKey);
  this.client.use(plugins.logout);
  this.client.use(plugins.presence);
  this.client.use(plugins.friends);
  this.client.use(plugins.notifications);
  this.client.use(plugins.webSession);
  this.client.use(plugins.disconnected);
  this.client.use(plugins.offlineMessages);
  this.client.use(plugins.trade);
};

Moonrise.prototype.connect = function () {
  this.client.connect();
};

module.exports = Moonrise;
