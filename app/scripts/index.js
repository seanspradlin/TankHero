'use strict';

window.onload = function() {
  var game = new Phaser.Game(800, 600, Phaser.WEBGL, 'game');
  game.state.add('Boot', States.Boot);
  game.state.add('Preload', States.Preload);
  game.state.add('Menu', States.Menu);
  game.state.add('Main', States.Main);
  game.state.add('End', States.End);

  game.state.start('Boot');

  Scoreboard.get();
  document.getElementById('record').style.visibility = 'hidden';
  document.getElementById('form').addEventListener('submit', function(event) {
    event.preventDefault();
    var name  = document.getElementById('name').value
      , score = End.finalScore || 0;
    Scoreboard.post(name, score);
    document.getElementById('record').style.visibility = 'hidden';
  }, true);
};