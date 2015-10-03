'use strict';
var States = States || {}
  , Main   = new Phaser.State();

Main.create = function() {
  var centerX = this.game.width/2
    , centerY = this.game.height/2;

  // Properties
  this.nextSpawn = 0;
  this.spawnDelay = 1500;
  this.supplyDrop = 25;
  this.supplyDropDelay = 50;
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
  this.world.setBounds(boundsX, boundsY, boundsWidth, boundsHeight);

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

  // Biplane
  this.biplane = this.add.existing(new Biplane(this.game));

  // Counters
  var fontOptions = {
    font: '24px Arial',
    fill: '#900',
    fontWeight: 'bold',
    stroke: '#ddd',
    strokeThickness: 3,
    align: 'center',
  };

  this.killCounter = this.add.text(50, 50, '', fontOptions);

  // Healthbar
  this.healthbar = this.add.existing(new Healthbar(this.game));

  // Instructions
  this.movementInstructions = this.add.text(centerX, centerY - 30,
    'Left/Right Arrow to Move', fontOptions);
  this.movementInstructions.anchor.x = 0.5;
  this.movementInstructions.anchor.y = 0.5;

  this.aimingInstructions = this.add.text(centerX, centerY,
    'Up/Down Arrow to Aim', fontOptions);
  this.aimingInstructions.anchor.x = 0.5;
  this.aimingInstructions.anchor.y = 0.5;

  this.firingInstructions = this.add.text(centerX, centerY + 30,
    'Spacebar to Fire', fontOptions);
  this.firingInstructions.anchor.x = 0.5;
  this.firingInstructions.anchor.y = 0.5;

  this.startMusic.play();
  this.startMusic.onStop.add(function() {
    Main.backgroundMusic.play('', 0, 0);
  });

  console.log('Game has begun');
};

Main.update = function() {
  this.player.gameOver();

  if (this.backgroundMusic.isPlaying) {
    if (this.backgroundMusic.volume < 1.0) {
      this.backgroundMusic.volume += 0.001;
    }
    if (this.firingInstructions.alpha > 0) {
      this.firingInstructions.alpha -= 0.005;
      this.aimingInstructions.alpha -= 0.005;
      this.movementInstructions.alpha -= 0.005;
    }
  }

  this.healthbar.setHealth(this.player.health);
  this.killCounter.text = 'Score: ' + this.totalKills;

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

  // Supply Drops
  this.spawnSupplyDrop();
  this.biplane.drop();

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

  // Supply Crate
  this.physics.arcade.collide(this.player, this.biplane.medkit, function(p, m) {
    m.kill();
    p.health += 5;
    p.health = p.health > p.maxHealth ? p.maxHealth : p.health;
  });

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

Main.spawnSupplyDrop = function() {
  if (this.totalKills < this.supplyDrop) { return; }
  this.biplane.reset(this.game.width * 1.5, 300);
  this.biplane.hasPayload = true;
  this.biplane.forward();
  this.supplyDrop += this.supplyDropDelay;
  this.supplyDropDelay += 25;
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