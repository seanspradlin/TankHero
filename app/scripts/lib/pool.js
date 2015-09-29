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

    // Panthers
    container.panthers = new Phaser.Group(game, game.world, 'Panthers', false);
    for (var i = 0; i < 1; i++) {
      var moveSpeed       = 80
        , firingDelay     = 3000
        , rangeFromPlayer = 500
        , panther         = new Panther(game, moveSpeed, firingDelay, rangeFromPlayer);

      container.panthers.add(panther);
    }

    // Panther Explosions
    container.pantherExplosions = new Phaser.Group(game, game.world, 'Panther Explosions', false);
    var pantherExplosionFrames = Phaser.Animation.generateFrameNames('panther/death', 1, 10);
    for (var i = 0; i < 1; i++) {
      var explosion = new Explosion(game, pantherExplosionFrames, 15);
      explosion.anchor.x = 0.5;
      explosion.anchor.y = 1.0;
      container.pantherExplosions.add(explosion);
    }

    // Jeeps
    container.jeeps = new Phaser.Group(game, game.world, 'Jeeps', false);
    for (var i = 0; i < 12; i++) {
      var moveSpeed   = 250 + Math.random() * 150
        , firingDelay = 1000 + Math.random() * 1500
        , jeep        = new Jeep(game, moveSpeed, firingDelay);

      container.jeeps.add(jeep);
    }

    // Jeep Explosions
    container.jeepExplosions = new Phaser.Group(game, game.world, 'Jeep Explosions', false);
    var jeepExplosionFrames = Phaser.Animation.generateFrameNames('jeep/death', 1, 9);
    for (var i = 0; i < 12; i++) {
      var explosion = new Explosion(game, jeepExplosionFrames, 15);
      explosion.anchor.x = 0.5;
      explosion.anchor.y = 1.0;
      container.jeepExplosions.add(explosion);
    }

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
    var explosionFrames = Phaser.Animation.generateFrameNames('explosion/', 1, 4);
    for (var i = 0; i < 10; i++) {
      var explosion = new Explosion(game, explosionFrames, 15);
      explosion.anchor.x = 0.5;
      explosion.anchor.y = 1.0;
      container.bombExplosions.add(explosion);
    }

    // Blasts
    container.blasts = new Phaser.Group(game, game.world, 'Blasts', false, false);
    var blastFrames = Phaser.Animation.generateFrameNames('blast/', 1, 8);
    for (var i = 0; i < 20; i++) {
      container.blasts.add(new Explosion(game, blastFrames, 15));
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

    return container;
  }
}());