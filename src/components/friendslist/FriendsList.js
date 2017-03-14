const React = require('react');

const ChatActions = require('../../actions/chat-actions.js');
const FriendsStore = require('../../stores/friends-store.js');

const FriendsListItem = require('./FriendsListItem.js');

const KEYS = {
  enter: 13
};

var FriendsList = React.createClass({
  _onChange: function () {
    this.setState({friends: FriendsStore.getAllSorted()});
  },

  _onSearch: function (evt) {
    this.setState({searchTerm: evt.target.value.trim()});
  },

  _onSearchSubmit: function (evt) {
    if (evt.keyCode === KEYS.enter) {
      evt.preventDefault();

      var firstFriend = this._firstUserThatMatchesSearchTerm();

      if (firstFriend) {
        ChatActions.openChat(firstFriend);
        this.setState({searchTerm: ''});
      }
    }
  },

  _userMatchesSearchTerm: function (user) {
    var searchTerm = this.state.searchTerm.toLowerCase();
    var username = user.username.toLowerCase();
    var id = user.id.toLowerCase();

    if (username.indexOf(searchTerm) > -1) {
      return true;
    }

    return id.indexOf(searchTerm) > -1;
  },

  _firstUserThatMatchesSearchTerm: function () {
    var friends = this.state.friends;

    for (var id in friends) {
      if (this._userMatchesSearchTerm(friends[id])) {
        return friends[id];
      }
    }
  },

  getInitialState: function () {
    return {
      friends: FriendsStore.getAllSorted(),
      searchTerm: ''
    };
  },

  componentDidMount: function () {
    FriendsStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    FriendsStore.removeChangeListener(this._onChange);
  },

  render: function () {
    var self = this;

    return (
      <ul className="list-group">
        <li className="list-group-header">
          <input
            className="form-control"
            type="text"
            placeholder="Search by name or Steam ID"
            value={this.state.searchTerm}
            onChange={this._onSearch}
            onKeyDown={this._onSearchSubmit} />
        </li>
        {self.state.friends.map(function (friend) {
          if (self._userMatchesSearchTerm(friend)) {
            return <FriendsListItem key={friend.id} user={friend} />;
          }
        })}
      </ul>
    );
  }
});

module.exports = FriendsList;
