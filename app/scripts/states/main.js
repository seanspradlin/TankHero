'use strict';
var States = States || {}
  , Main   = new Phaser.State()
  , ground, fog1, fog2
  , player, input, pool, totalKills;

Main.create = function() {
  // Properties
  this.nextSpawn = 0;
  this.spawnDelay = 2000;
  totalKills = 0;

  // Input
  input = this.input.keyboard.createCursorKeys();
  input.attack = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  // Bounds
  var boundsX       = this.game.width * -0.5
    , boundsY       = 0
    , boundsWidth   = this.game.width * 2.0
    , boundsHeight  = this.game.height - 25;
  this.world.bounds = new Phaser.Rectangle(boundsX, boundsY, boundsWidth, boundsHeight);

  // Enable physics
  this.physics.startSystem(Phaser.Physics.ARCADE);
  this.physics.arcade.gravity.y = 500.0;

  // Background
  var sky = this.add.image(0, 0, 'environment', 'sky');
  sky.width = this.game.width;
  sky.height = this.game.height;
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
  player = this.add.existing(new Player(this.game, 100, this.game.height - 50));
  player.scale.x = -2;
  player.scale.y = 2;

  this.healthCounter = Main.game.add.text(50, 50, '', {font: '18px Arial', fill: '#ffffff'});
  this.killCounter = Main.game.add.text(50, 75, '', {font: '18px Arial', fill: '#ffffff'});

  console.log('Game has begun');
};

Main.update = function() {
  this.healthCounter.text = 'Health: ' + player.health;
  this.killCounter.text = 'Kills: ' + totalKills;

  if (player.health === 0) {
    this.state.start('Menu');
  }

  fog1.x -= 0.5;
  fog2.x -= 1;

  this.spawnEnemies();

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

  // Kill on collision
  this.game.physics.arcade.collide(ground, player.shells, groundCollider);
  this.game.physics.arcade.collide(ground, pool.bombs, groundCollider);
  this.game.physics.arcade.collide(ground, pool.grenades, groundCollider);
  this.game.physics.arcade.collide(ground, pool.pantherShells, groundCollider);

  // Damage player
  this.game.physics.arcade.collide(player, pool.bombs, objectCollider);
  this.game.physics.arcade.collide(player, pool.grenades, objectCollider);
  this.game.physics.arcade.collide(player, pool.pantherShells, objectCollider);

  // Damage enemies
  this.game.physics.arcade.collide(pool.panthers, player.shells, objectCollider);
  this.game.physics.arcade.collide(pool.jeeps, player.shells, objectCollider);

  // Update existing enemies
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

  pool.jeeps.forEachExists(function(jeep) {
    jeep.forward();
    jeep.attack();
    if (jeep.x < -100) {
      jeep.kill();
    }
  });

  // Make grenades spin
  pool.grenades.forEachExists(function(grenade) {
    grenade.body.angularVelocity = -300;
  });
};

function groundCollider(ground, obj) {
  obj.kill();
}

function objectCollider(object, ammo) {
  object.health--;
  if (object.health <= 0) {
    object.kill();
    totalKills++;
  }
  ammo.kill();
}

Main.spawnEnemies = function() {
  if (this.game.time.time < this.nextSpawn) { return; }
  switch (Math.floor(Math.random() * 3)) {
    case 0: // Jeep
      if (pool.jeeps.countDead() > 0) {
        pool.jeeps
            .getFirstExists(false)
            .reset(this.world.bounds.right, this.physics.arcade.bounds.bottom);
        this.nextSpawn = this.game.time.time + this.spawnDelay;
      }
      break;
    case 1: // Bombers
      if (pool.bombers.countDead() > 0) {
        var bomber = pool.bombers.getFirstExists(false)
          , flip = bomber.scale.x === -1
          , x = flip ? this.game.width * -0.5 : this.game.width * 1.5
          , y = 300 * Math.random();
        bomber.reset(x, y);
        this.nextSpawn = this.game.time.time + this.spawnDelay;
      }
      break;
    case 2: // Panthers
      if (pool.panthers.countDead() > 0) {
        var panther = pool.panthers.getFirstExists(false);
        panther.reset(this.game.width * 1.25, this.physics.arcade.bounds.bottom, 6);
        this.nextSpawn = this.game.time.time + this.spawnDelay;
      }
  }
};

States.Main = Main;