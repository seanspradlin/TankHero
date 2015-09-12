'use strict';
Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

function Player(game, x, y) {

  // Properties
  this.firingDelay = 750;
  this.nextFire = 0;
  this.moveSpeed = 150;
  this.shellSpeed = 600;

  // Call base constructor
  Phaser.Sprite.call(this, game, x, y, 'sprites', 'player/body1');

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
    this.shells.add(new Shell(this.game), true);
  }
}

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

  var shell = this.shells.getFirstExists(false)
    , angle = this.cannon.angle * -1
    , x = this.cannon.world.x + this.cannon.width * -1
    , y = this.cannon.world.y + (this.cannon.rotation * this.cannon.width);

  this.cannon.animations.play('firing');
  this.nextFire = this.game.time.time + this.firingDelay;
  shell.reset(x, y);
  this.game.physics.arcade.velocityFromAngle(angle, this.shellSpeed, shell.body.velocity);
};