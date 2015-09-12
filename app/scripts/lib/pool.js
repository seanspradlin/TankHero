'use strict';

var Pool = (function() {
  var instance;
  var game;

  return function(sourceGame) {
    if (!instance) {
      game = sourceGame;
      instance = populate();
    }
    return instance;
  };

  function populate() {
    var container = {};

    // Bombs
    container.bombs = new Phaser.Group(game, game.world, 'Bombs', false);
    for (var i = 0; i < 10; i++) {
      container.bombs.add(new Bomb(game), true);
    }

    // Bomb Explosions
    container.bombExplosions = new Phaser.Group(game, game.world, 'Bomb Explosions', false, false);
    for (var i = 0; i < 10; i++) {
      container.bombExplosions.add(new Explosion(game), true);
    }

    return container;
  }
}());