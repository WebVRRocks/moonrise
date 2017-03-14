const React = require('react');

const ChatStore = require('../../stores/chat-store.js');

const Tab = require('./Tab.js');
const ChatWindow = require('./ChatWindow.js');
const MessageComposer = require('./MessageComposer.js');

const Chat = React.createClass({
  _tabbedCount: function () {
    var count = 0;

    for (var id in this.state.chats) {
      if (this.state.chats[id].tabbed) {
        count++;
      }
    }

    return count;
  },

  _onChange: function () {
    this.setState({chats: ChatStore.getAll()});
  },

  _createTabs: function () {
    var self = this;

    if (self._tabbedCount() > 0) {
      var tabs = Object.keys(self.state.chats).map(function (id) {
        // 'id' is SteamID64
        if (self.state.chats[id].tabbed) {
          return <Tab key={id} chat={self.state.chats[id]} />;
        }
      });

      return (
        <div className="tab-group">
          {tabs}
        </div>
      );
    }

    return <div/>;
  },

  getInitialState: function () {
    return {chats: ChatStore.getAll()};
  },

  componentDidMount: function () {
    ChatStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    ChatStore.removeChangeListener(this._onChange);
  },

  render: function () {
    var tabs = this._createTabs();

    return (
      <div className="chat">
        {tabs}
        <ChatWindow chats={this.state.chats}/>
        <MessageComposer chats={this.state.chats}/>
      </div>
    );
  }
});

module.exports = Chat;
