const React = require('react');
const ReactDOM = require('react-dom');

const APP_NAME = require('read-pkg-up').sync().productName;
const Loader = require('../../components/misc/Loader.js');

const SteamGuard = React.createClass({
  propTypes: {
    callback: React.PropTypes.func
  },

  _proceedSteamGuard: function (evt) {
    evt.preventDefault();

    this.props.callback(this.refs.authCode.value);
    ReactDOM.render(<Loader message="Connecting…" />, document.getElementById('app'));
  },

  componentDidMount: function () {
    this.refs.authCode.focus();
  },

  render: function () {
    return (
      <div className="window">
        <div className="window-content">
          <header className="app-header centered">
            <center>
              <h1 className="brand logo">{APP_NAME}</h1>
              <p className="app-message steamguard-instructions">
                Check your inbox for an email containing the Steam Guard auth code you need in order to log in to Steam.
              </p>
            </center>
            <form className="auth-form steamguard-form">
              <div className="form-group">
                <label>
                  <span className="form-label">Steam Guard code</span>
                  <input type="text" name="steamguard" ref="authCode" className="form-control form-control-authcode tt" placeholder="XXXXX" />
                </label>
              </div>
              <button className="btn btn-large btn-default" onClick={this._proceedSteamGuard} type="submit">Continue</button>
            </form>
          </header>
        </div>
      </div>
    );
  }
});

module.exports = SteamGuard;
