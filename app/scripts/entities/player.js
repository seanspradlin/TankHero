'use strict';
Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

function Player(game, x, y) {
  // Call base constructor
  Phaser.Sprite.call(this, game, x, y, 'sprites', 'player/body1');

  // Animations
  var forwardFrames = Phaser.Animation.generateFrameNames('player/body', 1, 6);
  this.animations.add('forward', forwardFrames, 8, true, false);

  var reverseFrames = Phaser.Animation.generateFrameNames('player/body', 6, 1);
  this.animations.add('reverse', reverseFrames, 8, true, false);

  // Anchor
  this.anchor.x = 0.5;
  this.anchor.y = 1.0;
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

};