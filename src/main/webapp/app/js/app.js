/** @jsx React.DOM */
'use strict';

var React = require('react');
var Comment = require('./components/comment');

var Routes = require('react-router/Routes');
var Route = require('react-router/Route');

var App = require('./components/App');
var Story = require('./components/Story');



var routes = (
  <Routes location="hash">
    <Route name="app" path="/" handler={App}>
      <Route name="story" path="/story/:storyId" handler={Story}/>
    </Route>
  </Routes>
);

//      <Route name="calendar" path="/search" handler={Search}/>
//      <DefaultRoute handler={Welcome}/>

/*AppBar({
    key: "12345",
    author: "ich",
    text: "Dies ist ein Test1"
  })*/

var app = React.renderComponent(
  routes,
  document.getElementById('container')
);
