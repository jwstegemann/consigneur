'use strict';

var React = require('react');
var Comment = require('./components/comment');


var app = React.renderComponent(
  Comment({
    key: "12345",
    author: "ich",
    text: "Dies ist ein Test"
  }),
  document.getElementById('container')
);
