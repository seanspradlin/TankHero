'use strict';

var Pool = (function() {
  var instance;

  return function() {
    if (!instance) {
      instance = {};
    }
    return instance;
  };
}());