var React = require('react');

var UIActions = require('../../actions/ui-actions.js');
var UserActions = require('../../actions/user-actions.js');
var UIStore = require('../../stores/ui-store.js');
var UserStore = require('../../stores/user-store.js');

var KEYS = {
  enter: 13
};

var ChangeNameDialog = React.createClass({
  _onChange: function () {
    this.setState({
      uiState: UIStore.get(),
      displayName: UserStore.get().username || ''
    });

    if (this.refs.displayName) {
      this.refs.displayName.focus();
      this.refs.displayName.select();
    }
  },

  _onDisplayNameChange: function (evt) {
    this.setState({displayName: evt.target.value});
  },

  _onCancel: function () {
    UIActions.changeNameCloseDialog();
  },

  _onSubmit: function (evt) {
    if (evt.keyCode === KEYS.enter) {
      this._onSave();
    }
  },

  _onSave: function () {
    var name = this.state.displayName.trim();

    if (name !== '') {
      UserActions.changeName(name);
      UIActions.changeNameCloseDialog();
    }
  },

  getInitialState: function () {
    return {
      uiState: UIStore.get(),
      displayName: ''
    };
  },

  componentDidMount: function () {
    UIStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    UIStore.removeChangeListener(this._onChange);
  },

  render: function () {
    if (!this.state.uiState.isChangeNameDialogOpen) {
      return null;
    }

    return (
      <dialog open>
        <header className="toolbar toolbar-header">
          <h1 className="title">Change your display name</h1>
        </header>

        <div className="content">
          <input
            type="text"
            className="form-control"
            ref="displayName"
            value={this.state.displayName}
            onChange={this._onDisplayNameChange}
            onKeyDown={this._onSubmit} />
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

module.exports = ChangeNameDialog;
