var Dispatcher = require('../dispatcher');
var Constants = require('../constants');

var FriendsActions = {
  init: friends => {
    Dispatcher.dispatch({
      type: Constants.FriendsActions.FRIENDS_INIT,
      friends: friends
    });
  },

  insertOrUpdate: friend => {
    Dispatcher.dispatch({
      type: Constants.FriendsActions.FRIENDS_INSERT_OR_UPDATE,
      friend: friend
    });
  },

  remove: friend => {
    Dispatcher.dispatch({
      type: Constants.FriendsActions.FRIENDS_REMOVE,
      friend: friend
    });
  },

  block: friend => {
    Dispatcher.dispatch({
      type: Constants.FriendsActions.FRIENDS_BLOCK,
      friend: friend
    });
  },

  add: id => {
    Dispatcher.dispatch({
      type: Constants.FriendsActions.FRIENDS_ADD,
      id: id
    });
  },

  sendTradeRequest: friend => {
    Dispatcher.dispatch({
      type: Constants.FriendsActions.FRIENDS_SEND_TRADE_REQUEST,
      friend: friend
    });
  },

  purge: id => {
    Dispatcher.dispatch({
      type: Constants.FriendsActions.FRIENDS_PURGE,
      id: id
    });
  }
};

module.exports = FriendsActions;
