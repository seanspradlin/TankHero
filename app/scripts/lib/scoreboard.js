'use strict';

/**
 * AJAX handler for getting/posting scores
 */
var Scoreboard = (function () {
  var scores = [];
  var url = 'https://shielded-meadow-7731.herokuapp.com/';
  var scoreboard;
  var _personalBest = 0;

  function personalBest() {
    return _personalBest;
  }

  /**
   * Check if value is personal best, stores if true
   * @param {number} value
   * @return boolean
   */
  function isBest(value) {
    if (value > _personalBest) {
      _personalBest = value;
      return true;
    }
    return false;
  }

  /**
   * Replaces the contents of the scoreboard with new values
   */
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

  /**
   * Gets the current top scores from the api
   * and populates the scoreboard
   */
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

  /**
   * Posts a score to the api
   * @param {string} name
   * @param {number} score
   * @param {function(error, data)} callback
   */
  function post(name, score) {
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

  /**
   * Compares the value to the current high scores
   * @param {number} value
   * @returns boolean
   */
  function compare(value) {
    for (var i = 0; i < scores.length; i++) {
      if (value >= scores[i].score) {
        return true;
      }
    }
    return false;
  }

  return {
    post: post,
    get: get,
    compare: compare,
    personalBest: personalBest,
    isBest: isBest
  };
} ());