'use strict';
Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

function Player(game, x, y) {
  var self = this;

  // Properties
  this.firingDelay = 60;
  this.cooldown = 0;
  this.moveSpeed = 150;
  this.shellSpeed = 150;

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
  this.cannon.events.onAnimationComplete.add(function() {
    self.cannon.animations.previous(firingFrames.length);
  });
  this.addChild(this.cannon);
}

Player.prototype.forward = function() {
  this.animations.play('forward');
  this.game.physics.arcade.moveToXY(this, this.game.width, this.game.height, this.moveSpeed);
};

Player.prototype.reverse = function() {
  this.animations.play('reverse');
  this.game.physics.arcade.moveToXY(this, 0, this.game.height, this.moveSpeed);
};

Player.prototype.halt = function() {
  this.animations.stop();
  this.game.physics.arcade.moveToXY(this, this.x, this.game.height, this.moveSpeed);
};

Player.prototype.attack = function() {
  if (this.cooldown <= 0) {
    this.cannon.animations.play('firing');
    this.cooldown = this.firingDelay;
  }
};

Player.prototype.tick = function() {
  console.log(this.body.velocity.x);
  this.cooldown--;
};