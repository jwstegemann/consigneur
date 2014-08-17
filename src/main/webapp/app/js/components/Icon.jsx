/** @jsx React.DOM */
'use strict';

var React = require('react');
 
module.exports = React.createClass({
  render : function() {
    var iconClass = (this.props.className ? this.props.className + " " : "") + "icon icon-" + this.props.key;
/*    var style = {}
    if (this.props.modifier) {
      iconClass += " icon-" + this.props.modifier
    }
    if (this.props.color) {
      style.fill = this.props.color
    }
    if (this.props.size) {
      style.fontSize = this.props.size
    } */
 
    return (
      <svg
        className={iconClass}
        dangerouslySetInnerHTML={{__html:
          "<use xlink:href=\"./icons/svg-symbols.svg#IconSvg-" + this.props.key + "\"></use>"
        }}>
      </svg>
    );
  }
});