/** @jsx React.DOM */
'use strict';

var React = require('react');

module.exports = React.createClass({
  render: function() {
    return (
      <div key={this.props.key} className="comment">
        <h2 className="commentAuthor">{this.props.author}</h2>
        <span>{this.props.text}</span>
      </div>
    );
  }
});
