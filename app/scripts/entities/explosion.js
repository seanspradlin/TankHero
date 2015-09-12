'use strict';
Explosion.prototype = Object.create(Phaser.Sprite.prototype);
Explosion.prototype.constructor = Explosion;

function Explosion(game) {
  // Call base constructor
  Phaser.Sprite.call(this, game, 0, 0, 'sprites', 'explosion/1');

  // Animations
  var boomFrames = Phaser.Animation.generateFrameNames('explosion/', 1, 4);
  this.animations.add('boom', boomFrames, 15, false, false);

  // Start off as dead
  this.exists = false;

  this.events.onAnimationComplete.add(function () {
    this.kill();
  }, this);
}

Explosion.prototype.bang = function(x, y) {
  this.reset(x, y);
  this.animations.play('boom');
};