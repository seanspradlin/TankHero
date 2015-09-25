'use strict';

window.onload = function() {
  var game = new Phaser.Game(1024, 768, Phaser.WEBGL, 'game');
  game.state.add('Boot', States.Boot);
  game.state.add('Preload', States.Preload);
  game.state.add('Menu', States.Menu);
  game.state.add('Main', States.Main);
  game.state.add('End', States.End);

  game.state.start('Boot');
};