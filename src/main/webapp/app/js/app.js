'use strict';

var React = require('react');
var Comment = require('./components/comment');
var AppBar = require('./components/AppBar');


var app = React.renderComponent(
  AppBar({
    key: "12345",
    author: "ich",
    text: "Dies ist ein Test1"
  }),
  document.getElementById('container')
);
