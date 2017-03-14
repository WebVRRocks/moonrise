var Dispatcher = require('../dispatcher');
var Constants = require('../constants');

var UserActions = {
  update: user => {
    Dispatcher.dispatch({
      type: Constants.UserActions.USER_UPDATE,
      user: user
    });
  },

  changeState: state => {
    Dispatcher.dispatch({
      type: Constants.UserActions.USER_CHANGE_STATE,
      state: state
    });
  },

  changeName: name => {
    Dispatcher.dispatch({
      type: Constants.UserActions.USER_CHANGE_NAME,
      name: name
    });
  },

  setWebSession: (cookies, sessionid) => {
    Dispatcher.dispatch({
      type: Constants.UserActions.USER_SET_WEBSESSION,
      cookies: cookies,
      sessionid: sessionid
    });
  }
};

module.exports = UserActions;
