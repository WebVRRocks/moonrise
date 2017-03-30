/* global moonrise */

const React = require('react');
const ReactDOM = require('react-dom');

const APP_NAME = require('read-pkg-up').sync().productName;
const Loader = require('../misc/Loader.js');

const Login = React.createClass({
  propTypes: {
    message: React.PropTypes.string
  },

  _proceedLogin: function (evt) {
    evt.preventDefault();

    const username = this.refs.username.value;
    const password = this.refs.password.value;
    const rememberMe = this.refs.rememberMe.checked;

    ReactDOM.render(<Loader message="Connecting…"/>, document.getElementById('app'));

    moonrise.init({
      username: username,
      password: password,
      rememberPassword: rememberMe
    }, function () {
      moonrise.loadPlugins();
      moonrise.connect();
    });
  },

  render: function () {
    return (
      <div className="window">
        <div className="window-content">
          <header className="app-header centered">
            <center>
              <h1 className="brand logo">{APP_NAME}</h1>
              <p className="app-message login">{this.props.message}</p>
            </center>
            <form className="auth-form login-form">
              <div className="form-group">
                <label>
                  <span className="form-label">Steam Username</span>
                  <input type="email" name="username" ref="username" className="form-control" placeholder="Username" autoFocus />
                </label>
              </div>
              <div className="form-group">
                <label>
                  <span className="form-label">Steam Password</span>
                  <input type="password" name="password" ref="password" className="form-control" placeholder="Password" />
                </label>
              </div>
              <div className="checkbox">
                <label>
                  <input type="checkbox" ref="rememberMe" checked /> <span className="form-label">Remember Me</span>
                </label>
              </div>
              <button className="btn btn-large btn-default" onClick={this._proceedLogin} type="submit">Login</button>
            </form>
          </header>
        </div>
      </div>
    );
  }
});

module.exports = Login;
