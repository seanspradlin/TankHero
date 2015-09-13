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

    // Bombers
    container.bombers = new Phaser.Group(game, game.world, 'Bombers', false);
    for (var i = 0; i < 4; i++) {
      var flip    = i % 1 === 0
        , scale   = flip ? -1 : 1
        , x       = flip ? game.width * - 0.5 : game.width * 1.5
        , y       = 200 + (200 * Math.random())
        , bomber  = new Bomber(game, x, y);

      bomber.scale.x = scale;
      container.bombers.add(bomber);
    }

    // Panthers
    container.panthers = new Phaser.Group(game, game.world, 'Panthers', false);
    for (var i = 0; i< 4; i++) {
      var moveSpeed       = 45 + Math.random() * 50
        , firingDelay     = 2000 + Math.random() * 2000
        , rangeFromPlayer = 300 + Math.random() * 400
        , panther         = new Panther(game, 0, 0, moveSpeed, firingDelay, rangeFromPlayer);
      container.panthers.add(panther);
    }

    return container;
  }
}());