const  React = require('react');
const  ReactDOM = require('react-dom');

const  Loader = require('../../components/misc/Loader.js');

const UIActions = require('../../actions/ui-actions.js');

const API_RECONNECT_DELAY = 3000;  // 3 seconds.

/**
 * Disconnected
 * Automatically reconnects Vapor client after we get disconnected.
 */

exports.name = 'moonrise-disconnected';

exports.plugin = function (API) {
  const log = API.getLogger();
  const Steam = API.getSteam();
  const utils = API.getUtils();

  let tryCount = 0;

  API.registerHandler({
    emitter: 'client',
    event: 'logOnResponse'
  }, function (response) {
    if (response.eresult === Steam.EResult.OK) {
      tryCount = 0;
    }
  });

  API.registerHandler({
    emitter: 'vapor',
    event: 'disconnected'
  }, function (err) {
    var enumString = utils.enumToString(err.eresult, Steam.EResult);
    log.warn('Got disconnected. EResult: %d (%s)', err.eresult, enumString);

    if (err.eresult === Steam.EResult.InvalidPassword ||
      err.eresult === Steam.EResult.InvalidLoginAuthCode) {
      let message = 'Login error: ';
      if (err.eresult === Steam.EResult.InvalidPassword) {
        message += 'Invalid Password';
      } else (err.eresult === Steam.EResult.InvalidLoginAuthCode) {
        message += 'Invalid Steam Guard auth code';
      }
      UIActions.logout(message);
    } else {
      setTimeout(function () {
        API.connect();
      }, API_RECONNECT_DELAY);

      var message = `Got disconnected: ${err.eresult} (${enumString}). Retrying… (${++tryCount})`;
      ReactDOM.render(<Loader message={message} />, document.getElementById('app'));
    }
  });
};
