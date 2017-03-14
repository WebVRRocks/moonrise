const React = require('react');

const ChatActions = require('../../actions/chat-actions.js');
const Constants = require('../../constants');

const KEYS = {
  enter: 13
};

const MessageComposer = React.createClass({
  propTypes: {
    chats: React.PropTypes.object.isRequired
  },

  _findVisibleChat: function () {
    for (var id in this.props.chats) {
      if (this.props.chats[id].visible) {
        return this.props.chats[id];
      }
    }
  },

  _onChange: function (evt) {
    this.setState({text: evt.target.value});

    const visible = this._findVisibleChat();

    if (!visible) {
      return;
    }

    ChatActions.weAreTyping(visible.id);
  },

  _onKeyDown: function (evt) {
    if (evt.keyCode === KEYS.enter && !evt.shiftKey) {
      evt.preventDefault();
      const text = this.state.text.trim();
      if (text !== '') {
        var targetChat = this._findVisibleChat();

        ChatActions.newOutgoingMessage({
          type: Constants.MessageTypes.CHAT_OUR_MESSAGE,
          target: targetChat.id,
          username: targetChat.username,
          date: new Date(),
          text: text
        });
      }
      this.setState({text: ''});
    }
  },

  getInitialState: function () {
    return {text: ''};
  },

  componentDidUpdate: function () {
    if (this.refs.textArea) {
      this.refs.textArea.focus();
    }
  },

  render: function () {
    var visible = this._findVisibleChat();

    if (!visible) {
      return null;
    }

    var extraInfo = (
      <div className="extra-info">
        <i className="fa fa-comment-o"></i> You are chatting with {visible.username}
      </div>
    );

    if (visible.typing) {
      extraInfo = (
        <div className="extra-info">
          <i className="fa fa-commenting-o"></i> {visible.username} is typing…
        </div>
      );
    }

    return (
      <div className="message-composer">
        {extraInfo}
        <textarea
          ref="textArea"
          rows="3"
          className="form-control"
          name="message"
          value={this.state.text}
          onChange={this._onChange}
          onKeyDown={this._onKeyDown} />
      </div>
    );
  }
});

module.exports = MessageComposer;
