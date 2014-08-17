/** @jsx React.DOM */
'use strict';

var React = require('react');

module.exports = React.createClass({
  render: function() {
    return (
      <div key={this.props.key} className="comment">
        <h2 className="commentAuthor">{this.props.author}</h2>
        <span>{this.props.text}</span>      

        <p className="display4">Dies ist ein Test</p>
        <p className="display3">Dies ist ein Test</p>
        <p className="display2">Dies ist ein Test</p>
        <p className="display3">Dies ist ein Test</p>
        <p className="title">Dies ist ein Test</p>
        <p className="subhead">Dies ist ein Test</p>
        <p className="caption">Dies ist ein Test</p>
        <p className="body2">Dies ist ein Test</p>
        <p className="body1">Dies ist ein Test</p>
        <p className="menu">Dies ist ein Test</p>
        <p className="body2">Dies ist ein Test</p>
        <p className="button">Dies ist ein Test</p>

      </div>
    );
  }
});
