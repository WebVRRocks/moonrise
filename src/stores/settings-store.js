var EventEmitter = require('events').EventEmitter;

var objectAssign = require('object-assign');

const Dispatcher = require('../dispatcher');

const CHANGE_EVENT = 'change';

const _settings = {
  checkForUpdatesOnStartup: true
};

let SettingsStore = objectAssign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  get: function () {
    return _settings;
  }
});

SettingsStore.dispatchToken = Dispatcher.register(action => {
  switch (action.type) {
    default:
      // ignore
  }
});

module.exports = SettingsStore;
