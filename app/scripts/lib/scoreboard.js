'use strict';

/**
 * AJAX handler for getting/posting scores
 */
var Scoreboard = (function () {
  var scores = [];
  var url = 'https://shielded-meadow-7731.herokuapp.com/';

  function get(callback) {
    var req = new XMLHttpRequest();

    req.addEventListener('load', function reqLoad() {
      try {
        scores = JSON.parse(this.responseText);
        callback(null, scores);
      } catch (error) {
        callback(error);
      }
    });

    req.addEventListener('error', function reqError() {
      try {
        var response = JSON.parse(this.responseText);
        callback(response);
      } catch (error) {
        callback(error);
      }
    });

    req.open('GET', url);
    req.send();
  }

  function post(name, score, callback) {
    var req = new XMLHttpRequest();
    var content = JSON.stringify({
      name: name,
      score: score
    });

    req.addEventListener('load', function () {
      try {
        scores = JSON.parse(this.responseText);
        callback(null, scores);
      } catch (error) {
        callback(error);
      }
    });

    req.addEventListener('error', function reqLoad() {
      try {
        var response = JSON.parse(this.responseText);
        callback(response);
      } catch (error) {
        callback(error);
      }
    });

    req.setRequestHeader('Content-Type', 'application/json');
    req.setRequestHeader('Content-Length', ''+content.length);
    req.open('POST', url);
    req.send(content);
  }

  return {
    get: get,
    post: post
  };
} ());