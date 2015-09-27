'use strict';

/**
 * AJAX handler for getting/posting scores
 */
var Scoreboard = (function () {
  var scores = [];
  var url = 'https://shielded-meadow-7731.herokuapp.com/';
  var scoreboard;

  function populate() {
    scoreboard = scoreboard || document.getElementById('scores');
    var html = createHeader();
    for (var i = 0; i < scores.length; i++) {
      html += createRow(scores[i]);
    }
    scoreboard.innerHTML = html;
  }

  function createHeader() {
    var head = '';
    head += '<thead><tr>';
    head += '<td>Name</td>';
    head += '<td>Score</td>';
    head += '<td>Date</td>';
    head += '</tr></thead>';
    return head;
  }

  function createRow(score) {
    var row = '';
    row += '<tr>';
    row += '<td>' + score.name + '</td>';
    row += '<td>' + score.score + '</td>';
    row += '<td>' + new Date(score.date).toLocaleDateString() + '</td>';
    row += '</tr>';
    return row;
  }

  function get() {
    var req = new XMLHttpRequest();

    req.addEventListener('load', function reqLoad() {
      try {
        scores = JSON.parse(this.responseText);
        populate();
      } catch (error) {
        console.error(error);
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
        populate();
      } catch (error) {
        console.error(error);
      }
    });

    req.open('POST', url);
    req.send(content);
  }

  return {
    post: post,
    get: get
  };
} ());