/** @jsx React.DOM */
'use strict';

var React = require('react');
var Icon = require('./Icon');

module.exports = React.createClass({
  render: function() {
    return (
      <div className="appbar">
        <div className="nav-icon">
          <Icon key="nav" className="icon-white icon-app-bar"/>
        </div>
        <div className="app-bar-title">Dies ist ein Titel</div>
        <div className="search-icon">
          <Icon key="menu" className="icon-white icon-app-bar"/>
        </div>
        <div className="menu-icon">
          <Icon key="search" className="icon-white icon-app-bar"/>
        </div>
      </div>
    );
  }
});
