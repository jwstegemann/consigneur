/** @jsx React.DOM */
'use strict';

var React = require('react');
var Icon = require('./Icon');

module.exports = React.createClass({
  render: function() {
    return (
      <div>
      <div className="story">Bin in App</div>

      <this.props.activeRouteHandler/>
      </div>
    );
  }
});
