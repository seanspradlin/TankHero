'use strict';
Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

function Player(game, x, y) {
  // Properties
  this.firingDelay = 750;
  this.nextFire = 0;
  this.moveSpeed = 300;
  this.shellSpeed = 600;
  this.maxHealth = 20;
  this.health = 20;

  // Call base constructor
  Phaser.Sprite.call(this, game, x, y, 'sprites', 'player/body1');

  // Player Death Animation
  var deathFrames1 = Phaser.Animation.generateFrameNames('player/death', 2, 6)
    , deathFrames2 = Phaser.Animation.generateFrameNames('player/death', 7, 20)
    , deathFrames3 = Phaser.Animation.generateFrameNames('player/death', 19, 20);
  this.playerDeath = new Phaser.Sprite(game, 0, 0, 'sprites', 'player/death1');

  var deathAnim1 = this.playerDeath.animations.add('death1', deathFrames1, 10, false, false);
  deathAnim1.onComplete.add(function() {
    game.sound.play('groan');
    this.playerDeath.play('death2');
  }, this);

  var deathAnim2 = this.playerDeath.animations.add('death2', deathFrames2, 10, false, false);
  deathAnim2.onComplete.add(function() {
    var fart = game.sound.play('fart', 1.5);
    fart.onStop.add(function() {
      this.gameOverTime = game.time.time + 2000;
    }, this);
    this.playerDeath.play('death3');
  }, this);

  this.playerDeath.animations.add('death3', deathFrames3, 10, true, false);

  this.playerDeath.scale.x = -1.5;
  this.playerDeath.scale.y = 1.5;
  this.playerDeath.anchor.x = 0.5;
  this.playerDeath.anchor.y = 1.0;
  this.playerDeath.exists = false;
  Main.add.existing(this.playerDeath);

  // Animations
  var forwardFrames = Phaser.Animation.generateFrameNames('player/body', 1, 6);
  this.animations.add('forward', forwardFrames, 12, true, false);

  var reverseFrames = Phaser.Animation.generateFrameNames('player/body', 6, 1);
  this.animations.add('reverse', reverseFrames, 12, true, false);

  // Anchor
  this.anchor.x = 0.5;
  this.anchor.y = 1.0;

  // Physics
  this.game.physics.enable(this);
  this.body.collideWorldBounds = true;
  this.body.setSize(60, 38);

  // Cannon
  this.cannon = new Phaser.Sprite(this.game, -8, -36, 'sprites', 'player/cannon1');
  var firingFrames = Phaser.Animation.generateFrameNames('player/cannon', 1, 4);
  this.cannon.anchor.x = 0.0;
  this.cannon.anchor.y = 0.5;
  this.cannon.scale.x = -2.0;
  this.cannon.animations.add('firing', firingFrames, 10, false, false);
  this.cannon.events.onAnimationComplete.add(function () {
    this.cannon.animations.previous(firingFrames.length);
  }, this);
  this.addChild(this.cannon);

  // Shells
  this.shells = new Phaser.Group(this.game, this.game.world, 'Player Shells', false, true, Phaser.Physics.ARCADE);
  for (var i = 0; i < 5; i++) {
    this.shells.add(new Shell(this.game, 'player/shell', false), true);
  }

  this.events.onKilled.add(function() {
    console.log('Player killed');
    game.sound.play('panther-explosion');
    this.playerDeath.reset(this.x - 36, this.y);
    this.playerDeath.animations.play('death1');
  }, this);
}

Player.prototype.gameOver = function() {
  if (this.gameOverTime) {
    if (this.game.time.time < this.gameOverTime) { return; }
    this.game.state.start('End', true, false, Main.totalKills);
  }
};

Player.prototype.forward = function () {
  this.animations.play('forward');
  this.game.physics.arcade.moveToXY(this, this.game.width, this.game.height, this.moveSpeed);
};

Player.prototype.reverse = function () {
  this.animations.play('reverse');
  this.game.physics.arcade.moveToXY(this, 0, this.game.height, this.moveSpeed);
};

Player.prototype.halt = function () {
  this.animations.stop();
  this.game.physics.arcade.moveToXY(this, this.x, this.game.height, this.moveSpeed);
};

Player.prototype.attack = function () {
  if (this.game.time.time < this.nextFire) { return; }
  if (this.shells.countDead() === 0) { return; }
  if (!this.alive) { return; }

  var shell = this.shells.getFirstExists(false)
    , angle = this.cannon.angle * -1
    , x = this.cannon.world.x + this.cannon.width * -1
    , y = this.cannon.world.y + (this.cannon.rotation * this.cannon.width);

  this.cannon.animations.play('firing');
  this.game.sound.play('fire');
  this.nextFire = this.game.time.time + this.firingDelay;
  shell.reset(x, y);
  this.game.physics.arcade.velocityFromAngle(angle, this.shellSpeed, shell.body.velocity);
};