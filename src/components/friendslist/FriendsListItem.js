const remote = require('electron').remote;

const React = require('react');
const classNames = require('classnames');

const ChatActions = require('../../actions/chat-actions.js');
const Constants = require('../../constants');

const FriendsListItem = React.createClass({
  propTypes: {
    user: React.PropTypes.object.isRequired
  },

  _getOnlineStateClassName: function () {
    if(this.props.user.inGame) {
      return 'in-game-border';
    }

    switch (this.props.user.stateEnum) {
      case 0:
        return 'offline-border';
      default:
        return 'online-border';
    }
  },

  _getRelationshipStateClassName: function () {
    return 'relationship-' + this.props.user.relationshipEnum;
  },

  _onDoubleClick: function (evt) {
    evt.preventDefault();
    if(this.props.user.relationshipEnum === Constants.SteamEnums.EFriendRelationship.Friend) {
      ChatActions.openChat(this.props.user);
    }
  },

  _onContextMenu: function (evt) {
    evt.preventDefault();
    var menu = require('../../ui/menus/friends-menu.js')(this.props.user);
    menu.popup(remote.getCurrentWindow());
  },

  render: function () {
    var classNameItem = classNames('list-group-item', this._getRelationshipStateClassName());
    var classNameAvatar = classNames('img-circle', 'media-object', 'pull-left', this._getOnlineStateClassName());

    return (
      <li className={classNameItem} onDoubleClick={this._onDoubleClick} onContextMenu={this._onContextMenu}>
        <img className={classNameAvatar} src={this.props.user.avatar} width="32" height="32" />
        <div className="media-body">
          <strong>{this.props.user.username}</strong>
          <p>{this.props.user.state}</p>
        </div>
      </li>
    );
  }
});

module.exports = FriendsListItem;
