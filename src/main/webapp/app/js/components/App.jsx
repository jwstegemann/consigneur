/** @jsx React.DOM */
'use strict';

var React = require('react');
var Icon = require('./Icon');

var AppBar = require('./AppBar');


module.exports = React.createClass({
  render: function() {
    return (
      <div className="app">
        <AppBar />
        <div className="view">
          <this.props.activeRouteHandler/>
        </div>
      </div>
    );
  }
});
