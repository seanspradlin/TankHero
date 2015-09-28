'use strict';

var Pool = (function() {
  var instance;
  var game;

  return function(sourceGame, refresh) {
    if (!instance || refresh) {
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
      container.bombs.add(new Bomb(game));
    }

    // Grenades
    container.grenades = new Phaser.Group(game, game.world, 'Grenades', false, true, Phaser.Physics.ARCADE);
    for (var i = 0; i < 20; i++) {
      container.grenades.add(new Shell(game, 'jeep/grenade'), true);
    }

    // Panther Shells
    container.pantherShells = new Phaser.Group(game, game.world, 'Panther Shells', false, true, Phaser.Physics.ARCADE);
    for (var i = 0; i < 10; i++) {
      container.pantherShells.add(new Shell(game, 'player/shell'), true);
    }

    // Bomb Explosions
    container.bombExplosions = new Phaser.Group(game, game.world, 'Bomb Explosions', false, false);
    for (var i = 0; i < 10; i++) {
      container.bombExplosions.add(new Explosion(game));
    }

    // Bombers
    container.bombers = new Phaser.Group(game, game.world, 'Bombers', false);
    for (var i = 0; i < 4; i++) {
      var flip    = i % 2 === 0
        , scale   = flip ? -1 : 1
        , x       = flip ? game.width * -0.5 : game.width * 1.5
        , y       = 50 + (100 * i)
        , bomber  = new Bomber(game, x, y);
      bomber.scale.x = scale;
      container.bombers.add(bomber);
    }

    // Panthers
    container.panthers = new Phaser.Group(game, game.world, 'Panthers', false);
    for (var i = 0; i < 1; i++) {
      var moveSpeed       = 80
        , firingDelay     = 3000
        , rangeFromPlayer = 500
        , panther         = new Panther(game, moveSpeed, firingDelay, rangeFromPlayer);

      container.panthers.add(panther);
    }

    // Jeeps
    container.jeeps = new Phaser.Group(game, game.world, 'Jeeps', false);
    for (var i = 0; i < 8; i++) {
      var moveSpeed   = 250 + Math.random() * 150
        , firingDelay = 1000 + Math.random() * 1500
        , jeep        = new Jeep(game, moveSpeed, firingDelay);

      container.jeeps.add(jeep);
    }

    return container;
  }
}());