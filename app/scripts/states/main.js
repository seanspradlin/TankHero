'use strict';
var States = States || {}
  , Main   = new Phaser.State()
  , ground, player, pool, totalKills;

Main.create = function() {
  // Properties
  this.nextSpawn = 0;
  this.spawnDelay = 1500;
  totalKills = 0;

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
  this.fog1 = this.add.tileSprite(0, this.game.height, 2400, 400, 'environment', 'dust1');
  this.fog1.anchor.y = 1.0;
  this.fog1.alpha = 0.5;

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
  this.fog2 = this.add.tileSprite(0, this.game.height, 2400, 400, 'environment', 'dust2');
  this.fog2.anchor.y = 1.0;
  this.fog2.alpha = 0.5;

  // Pool
  pool = Pool(this.game, true);

  // Player
  player = this.add.existing(new Player(this.game, 100, this.game.height - 25));
  player.scale.x = -2;
  player.scale.y = 2;

  this.healthCounter = this.add.text(50, 50, '', {font: '18px Arial', fill: '#ffffff'});
  this.killCounter = this.add.text(50, 75, '', {font: '18px Arial', fill: '#ffffff'});

  this.game.sound.play('game-start');
  console.log('Game has begun');
};

Main.update = function() {
  this.healthCounter.text = 'Health: ' + player.health;
  this.killCounter.text = 'Score: ' + totalKills;

  if (player.health === 0) {
    this.state.start('End');
  }

  this.fog1.x -= 0.5;
  this.fog2.x -= 1;

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
      jeep.exists = false;
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
    totalKills += object.scoreValue || 1;
  }
  ammo.kill();
}

Main.spawnEnemies = function() {
  if (this.game.time.time < this.nextSpawn) { return; }
  switch (Math.floor(Math.random() * 6)) {
    case 0: // Jeep
    case 1:
    case 2:
      if (pool.jeeps.countDead() > 0) {
        pool.jeeps
            .getFirstExists(false)
            .reset(this.world.bounds.right, this.physics.arcade.bounds.bottom);
        this.nextSpawn = this.game.time.time + this.spawnDelay;
      }
      break;
    case 3: // Bombers
    case 4:
      if (pool.bombers.countDead() > 0) {
        var bomber = pool.bombers.getFirstExists(false)
          , flip = bomber.scale.x === -1
          , x = flip ? this.game.width * -0.5 : this.game.width * 1.5
          , y = bomber.y;
        bomber.reset(x, y);
        this.nextSpawn = this.game.time.time + this.spawnDelay;
      }
      break;
    case 5: // Panthers
      if (pool.panthers.countDead() > 0) {
        var panther = pool.panthers.getFirstExists(false);
        panther.reset(this.game.width * 1.25, this.physics.arcade.bounds.bottom, 6);
        this.nextSpawn = this.game.time.time + this.spawnDelay;
      }
  }
};

States.Main = Main;