'use strict';
Panther.prototype = Object.create(Phaser.Sprite.prototype);
Panther.prototype.constructor = Panther;

function Panther(game, x, y, moveSpeed, attackSpeed) {
  var self = this;

  // Call base constructor
  Phaser.Sprite.call(this, game, x, y, 'sprites', 'panther/body1');
  this.moveSpeed = moveSpeed;
  this.attackSpeed = attackSpeed;

  // Animations
  var forwardFrames = Phaser.Animation.generateFrameNames('panther/body', 4, 1);
  this.animations.add('forward', forwardFrames, 8, true, false);

  var reverseFrames = Phaser.Animation.generateFrameNames('panther/body', 1, 4);
  this.animations.add('reverse', reverseFrames, 8, true, false);

  // Anchor
  this.anchor.x = 0.5;
  this.anchor.y = 1.0;

  // Cannon
  this.cannon = new Phaser.Sprite(this.game, -27, -44, 'sprites', 'panther/cannon1');
  this.cannon.anchor.x = 1.0;
  this.cannon.anchor.y = 0.5;
  var firingFrames = Phaser.Animation.generateFrameNames('panther/cannon', 1, 4);
  this.cannon.animations.add('firing', firingFrames, 10, false, false);
  this.cannon.events.onAnimationComplete.add(function () {
    self.cannon.animations.previous(firingFrames.length);
  });
  this.addChild(this.cannon);
}

Panther.prototype.forward = function () {
  this.animations.play('forward');
};

Panther.prototype.reverse = function () {
  this.animations.play('reverse');
};

Panther.prototype.halt = function() {
  this.animations.stop();
};

Panther.prototype.attack = function () {
  this.cannon.animations.play('firing');
};