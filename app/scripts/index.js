'use strict';

window.onload = function() {
  var game = new Phaser.Game(1536, 768, Phaser.AUTO, 'game');
  game.state.add('Boot', States.Boot);
  game.state.add('Preload', States.Preload);
  game.state.add('Menu', States.Menu);
  game.state.add('Main', States.Main);

  game.state.start('Boot');
};