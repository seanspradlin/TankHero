'use strict';
var States = States || {}
  , Main   = new Phaser.State()
  , ground, fog1, fog2
  , player, input, pool;

Main.create = function() {
  // Input
  input = this.input.keyboard.createCursorKeys();
  input.attack = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  // Enable physics
  this.physics.startSystem(Phaser.Physics.ARCADE);
  this.physics.arcade.gravity.y = 500.0;

  // Bounds
  var boundsX       = this.game.width * -0.5
    , boundsY       = 0
    , boundsWidth   = this.game.width * 2.0
    , boundsHeight  = this.game.height - 25;
  this.physics.arcade.bounds = new Phaser.Rectangle(boundsX, boundsY, boundsWidth, boundsHeight);

  // Background
  this.add.image(0, 0, 'environment', 'sky').height = this.game.height;
  var trees1 = this.add.image(0,this.game.height - 10, 'environment', 'trees1');
  trees1.width = this.game.width;
  trees1.alpha = 0.3;
  trees1.anchor.y = 1.0;
  var trees2 = this.add.image(0,this.game.height - 20, 'environment', 'trees2');
  trees2.width = this.game.width;
  trees2.alpha = 0.2;
  trees2.anchor.y = 1.0;

  // Fog 1
  fog1 = this.add.tileSprite(0, this.game.height, 2400, 400, 'environment', 'dust1');
  fog1.anchor.y = 1.0;
  fog1.alpha = 0.5;

  // Ground
  ground = this.add.sprite(0, this.game.height, 'environment', 'ground');
  ground.width = this.game.width;
  ground.height = 25;
  ground.anchor.y = 1.0;
  this.game.physics.enable(ground);
  ground.body.immovable = true;
  ground.body.allowGravity = false;
  ground.body.setSize(this.game.width, ground.height);

  // Fog 2
  fog2 = this.add.tileSprite(0, this.game.height, 2400, 400, 'environment', 'dust2');
  fog2.anchor.y = 1.0;
  fog2.alpha = 0.5;

  // Pool
  pool = Pool(this.game);

  // Player
  player = this.add.existing(new Player(this.game, 100, this.game.height - 100));
  player.scale.x = -2;
  player.scale.y = 2;

  // Bombers
  pool.bombers.getFirstExists(false).reset();

  // Panthers
  pool.panthers.getFirstExists(false).reset(this.game.width * 1.25, this.physics.arcade.bounds.bottom);

  console.log('Game has begun');
};

Main.update = function() {
  fog1.x -= 0.5;
  fog2.x -= 1;

  // Move left/right
  if (input.left.isDown) {
    player.reverse();
  } else if (input.right.isDown) {
    player.forward();
  } else {
    player.halt();
  }

  // Aim up/down
  if (input.up.isDown && player.cannon.angle <= 25) {
    player.cannon.angle++;
  } else if (input.down.isDown && player.cannon.angle >= -5) {
    player.cannon.angle--;
  }

  // Attack
  if (input.attack.isDown) {
    player.attack();
  }

  this.game.physics.arcade.collide(ground, player.shells, function(g, s) {
    s.kill();
  });

  this.game.physics.arcade.collide(ground, Pool(this.game).bombs, function(g, b) {
    b.kill();
  });

  pool.bombers.forEachExists(function(bomber) {
    bomber.forward();
    bomber.attack();
  }, this);

  pool.panthers.forEachExists(function(panther) {
    var distance    = Main.physics.arcade.distanceBetween(panther, player)
      , minDistance = panther.rangeFromPlayer - 50
      , maxDistance = panther.rangeFromPlayer + 50;

    if (distance > maxDistance) {
      panther.forward();
    } else if (distance < minDistance) {
      panther.reverse();
    } else {
      panther.halt();
    }

    panther.attack();
  }, this);
};

States.Main = Main;