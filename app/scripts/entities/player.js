'use strict';
Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

function Player(game, x, y) {
  var self = this;

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

  var cannon = new Phaser.Sprite(this.game, -8, -36, 'sprites', 'player/cannon1');
  var firingFrames = Phaser.Animation.generateFrameNames('player/cannon', 1, 4);
  cannon.anchor.x = 0.0;
  cannon.anchor.y = 0.5;
  cannon.scale.x = -2.0;
  cannon.animations.add('firing', firingFrames, 10, false, false);
  cannon.events.onAnimationComplete.add(function() {
    self.cannon.animations.previous(firingFrames.length);
  });
  this.cannon = this.addChild(cannon);
}

Player.prototype.forward = function() {
  this.animations.play('forward');
};

Player.prototype.reverse = function() {
  this.animations.play('reverse');
};

Player.prototype.halt = function() {
  this.animations.stop();
};

Player.prototype.attack = function() {
  this.cannon.animations.play('firing');
};