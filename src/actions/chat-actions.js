var Dispatcher = require('../dispatcher');
var Constants = require('../constants');

var ChatActions = {
  newIncomingMessage: message => {
    Dispatcher.dispatch({
      type: Constants.ChatActions.CHAT_NEW_INCOMING_MESSAGE,
      message: message
    });
  },

  newOutgoingMessage: message => {
    Dispatcher.dispatch({
      type: Constants.ChatActions.CHAT_NEW_OUTGOING_MESSAGE,
      message: message
    });
  },

  echoMessage: message => {
    Dispatcher.dispatch({
      type: Constants.ChatActions.CHAT_ECHO_MESSAGE,
      message: message
    });
  },

  openChat: user => {
    Dispatcher.dispatch({
      type: Constants.ChatActions.CHAT_OPEN,
      user: user
    });
  },

  switchChat: chat => {
    Dispatcher.dispatch({
      type: Constants.ChatActions.CHAT_SWITCH,
      chat: chat
    });
  },

  closeChat: chat => {
    Dispatcher.dispatch({
      type: Constants.ChatActions.CHAT_CLOSE,
      chat: chat
    });
  },

  clearChat: chat => {
    Dispatcher.dispatch({
      type: Constants.ChatActions.CHAT_CLEAR,
      chat: chat
    });
  },

  requestOfflineMessages: () => {
    Dispatcher.dispatch({
      type: Constants.ChatActions.CHAT_REQUEST_OFFLINE_MESSAGES
    });
  },

  respondToTradeRequest: (chat, message, response) => {
    Dispatcher.dispatch({
      type: Constants.ChatActions.CHAT_RESPOND_TO_TRADE_REQUEST,
      chat: chat,
      message: message,
      response: response
    });
  },

  incomingTradeRequestResponse: response => {
    Dispatcher.dispatch({
      type: Constants.ChatActions.CHAT_INCOMING_TRADE_REQUEST_RESPONSE,
      response: response
    });
  },

  cancelTradeRequest: id => {
    Dispatcher.dispatch({
      type: Constants.ChatActions.CHAT_CANCEL_TRADE_REQUEST,
      id: id
    });
  },

  otherUserIsTyping: steamId => {
    Dispatcher.dispatch({
      type: Constants.ChatActions.OTHER_USER_IS_TYPING,
      steamId: steamId
    });
  },

  otherUserStoppedTyping: steamId => {
    Dispatcher.dispatch({
      type: Constants.ChatActions.OTHER_USER_STOPPED_TYPING,
      steamId: steamId
    });
  },

  weAreTyping: steamId => {
    Dispatcher.dispatch({
      type: Constants.ChatActions.WE_ARE_TYPING,
      steamId: steamId
    });
  }
};

module.exports = ChatActions;
