var React = require('react');

var UIActions = require('../../actions/ui-actions.js');
var FriendsActions = require('../../actions/friends-actions.js');
var UIStore = require('../../stores/ui-store.js');

const KEYS = {
  enter: 13
};

var AddFriendDialog = React.createClass({
  _onChange: function () {
    this.setState({uiState: UIStore.get()});
  },

  _onFriendIdChange: function (evt) {
    this.setState({friendId: evt.target.value});
  },

  _onCancel: function () {
    UIActions.addFriendCloseDialog();
  },

  _onSubmit: function (evt) {
    if (evt.keyCode === KEYS.enter) {
      this._onSave();
    }
  },

  _onSave: function () {
    var id = this.state.friendId.trim();

    if (id !== '') {
      FriendsActions.add(id);
      UIActions.addFriendCloseDialog();

      this.setState({displayName: ''});
    }
  },

  getInitialState: function () {
    return {
      uiState: UIStore.get(),
      friendId: ''
    };
  },

  componentDidMount: function () {
    UIStore.addChangeListener(this._onChange);
  },

  componentDidUpdate: function () {
    if (this.refs.friendId) {
      this.refs.friendId.focus();
    }
  },

  componentWillUnmount: function () {
    UIStore.removeChangeListener(this._onChange);
  },

  render: function () {
    if (!this.state.uiState.isAddFriendDialogOpen) {
      return null;
    }

    return (
      <dialog open>
        <header className="toolbar toolbar-header">
          <h1 className="title">Add friend</h1>
        </header>

        <div className="content">
          <input
            type="text"
            className="form-control"
            placeholder="SteamID64"
            ref="friendId"
            value={this.state.friendId}
            onChange={this._onFriendIdChange} />
        </div>

        <footer className="toolbar toolbar-footer">
          <div className="toolbar-actions">
            <button className="btn btn-default" onClick={this._onCancel}>Cancel</button>
            <button className="btn btn-primary pull-right" onClick={this._onSave} type="submit">Save</button>
          </div>
        </footer>
      </dialog>
    );
  }
});

module.exports = AddFriendDialog;
