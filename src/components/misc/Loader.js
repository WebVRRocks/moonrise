/* global moonrise */

const React = require('react');

const APP_NAME = require('../../../../package.json').productName;

const Loader = React.createClass({
  propTypes: {
    message: React.PropTypes.string
  },

  render: function () {
    return (
      <div className="window">
        <div className="window-content">
          <header className="app-header centered">
            <center>
              <h1 className="brand logo">{APP_NAME}</h1>
              <br />
              <h2><i className="fa fa-refresh fa-spin"></i></h2>
              <p className="app-message loader">{this.props.message}</p>
            </center>
          </header>
        </div>
      </div>
    );
  }
});

module.exports = Loader;
