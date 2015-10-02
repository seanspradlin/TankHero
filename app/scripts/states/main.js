'use strict';
var States = States || {}
  , Main   = new Phaser.State();

Main.create = function() {
  // Properties
  this.nextSpawn = 0;
  this.spawnDelay = 1500;
  this.totalKills = 0;

  // Sounds
  this.startMusic = this.sound.add('game-start', 1.0, false);
  this.backgroundMusic = this.sound.add('background-music', 0, true);

  // Input
  this.keyboard = this.input.keyboard.createCursorKeys();
  this.keyboard.attack = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

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
  this.ground = this.add.sprite(0, this.game.height, 'environment', 'ground');
  this.ground.width = this.game.width;
  this.ground.height = 25;
  this.ground.anchor.y = 1.0;
  this.game.physics.enable(this.ground);
  this.ground.body.immovable = true;
  this.ground.body.allowGravity = false;
  this.ground.body.setSize(this.game.width, this.ground.height);

  // Fog 2
  this.fog2 = this.add.tileSprite(0, this.game.height, 2400, 400, 'environment', 'dust2');
  this.fog2.anchor.y = 1.0;
  this.fog2.alpha = 0.5;

  // Pool
  this.pool = Pool(this.game, true);

  // Player
  this.player = this.add.existing(new Player(this.game, 100, this.game.height - 25));
  this.player.scale.x = -2;
  this.player.scale.y = 2;

  this.healthCounter = this.add.text(50, 50, '', {font: '18px Arial', fill: '#ffffff'});
  this.killCounter = this.add.text(50, 75, '', {font: '18px Arial', fill: '#ffffff'});

  this.startMusic.play();
  this.startMusic.onStop.add(function() {
    Main.backgroundMusic.play('', 0, 0.05);
  });

  console.log('Game has begun');
};

Main.update = function() {
  console.log('playing: ' + this.backgroundMusic.isPlaying);
  console.log('volume: ' + this.backgroundMusic.volume);
  if (this.backgroundMusic.isPlaying && this.backgroundMusic.volume < 1.0) {
    this.backgroundMusic.volume += 0.001;
  }

  this.healthCounter.text = 'Health: ' + this.player.health;
  this.killCounter.text = 'Score: ' + this.totalKills;

  if (this.player.health === 0) {
    this.state.start('End', true, false, this.totalKills);
  }

  this.fog1.x -= 0.5;
  this.fog2.x -= 1;

  // Move left/right
  if (this.keyboard.left.isDown) {
    this.player.reverse();
  } else if (this.keyboard.right.isDown) {
    this.player.forward();
  } else {
    this.player.halt();
  }

  // Aim up/down
  if (this.keyboard.up.isDown && this.player.cannon.angle <= 25) {
    this.player.cannon.angle++;
  } else if (this.keyboard.down.isDown && this.player.cannon.angle >= -5) {
    this.player.cannon.angle--;
  }

  // Attack
  if (this.keyboard.attack.isDown) {
    this.player.attack();
  }

  // Kill on collision
  this.physics.arcade.collide(this.ground, this.player.shells, this.groundCollider);
  this.physics.arcade.collide(this.ground, this.pool.bombs, this.groundCollider);
  this.physics.arcade.collide(this.ground, this.pool.grenades, this.groundCollider);
  this.physics.arcade.collide(this.ground, this.pool.pantherShells, this.groundCollider);

  // Damage this.player
  this.physics.arcade.collide(this.player, this.pool.bombs, this.objectCollider);
  this.physics.arcade.collide(this.player, this.pool.grenades, this.objectCollider);
  this.physics.arcade.collide(this.player, this.pool.pantherShells, this.objectCollider);

  // Damage enemies
  this.physics.arcade.collide(this.pool.panthers, this.player.shells, this.objectCollider);
  this.physics.arcade.collide(this.pool.jeeps, this.player.shells, this.objectCollider);

  // Update existing enemies
  if (this.backgroundMusic.isPlaying) {
    this.spawnEnemies();
    
    this.pool.bombers.forEachExists(function(bomber) {
      bomber.forward();
      bomber.attack();
    }, this);

    this.pool.panthers.forEachExists(function(panther) {
      var distance    = Main.physics.arcade.distanceBetween(panther, this.player)
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

    this.pool.jeeps.forEachExists(function(jeep) {
      jeep.forward();
      jeep.attack();
      if (jeep.x < -100) {
        jeep.exists = false;
      }
    });

    // Make grenades spin
    this.pool.grenades.forEachExists(function(grenade) {
      grenade.body.angularVelocity = -300;
    });
  }
};

Main.groundCollider = function(ground, obj) {
  obj.kill();
};

Main.objectCollider = function(object, ammo) {
  object.health--;
  if (object.health <= 0) {
    object.kill();
    Main.totalKills += object.scoreValue || 1;
  }
  ammo.kill();
};

Main.spawnEnemies = function() {
  if (this.game.time.time < this.nextSpawn) { return; }
  switch (Math.floor(Math.random() * 6)) {
    case 0: // Jeep
    case 1:
    case 2:
      if (this.pool.jeeps.countDead() > 0) {
        this.pool.jeeps
            .getFirstExists(false)
            .reset(this.world.bounds.right, this.physics.arcade.bounds.bottom);
        this.nextSpawn = this.game.time.time + this.spawnDelay;
      }
      break;
    case 3: // Bombers
    case 4:
      if (this.pool.bombers.countDead() > 0) {
        var bomber = this.pool.bombers.getFirstExists(false)
          , flip = bomber.scale.x === -1
          , x = flip ? this.game.width * -0.5 : this.game.width * 1.5
          , y = bomber.y;
        bomber.reset(x, y);
        this.nextSpawn = this.game.time.time + this.spawnDelay;
      }
      break;
    case 5: // Panthers
      if (this.pool.panthers.countDead() > 0) {
        var panther = this.pool.panthers.getFirstExists(false);
        panther.reset(this.game.width * 1.25, this.physics.arcade.bounds.bottom, 6);
        this.nextSpawn = this.game.time.time + this.spawnDelay;
      }
  }
};

Main.shutdown = function() {
  this.sound.stopAll();
};

States.Main = Main;