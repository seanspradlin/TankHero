'use strict';
Explosion.prototype = Object.create(Phaser.Sprite.prototype);
Explosion.prototype.constructor = Explosion;

function Explosion(game, x, y) {
  // Call base constructor
  Phaser.Sprite.call(this, game, x, y, 'sprites', 'explosion/1');

  // Animations
  var boomFrames = Phaser.Animation.generateFrameNames('explosion/', 1, 4);
  this.animations.add('boom', boomFrames, 15, false, false);

  // Start off as dead
  this.kill();

  this.events.onAnimationComplete.add(function () {
    this.kill();
  }, this);

  this.events.onRevived.add(function() {
    this.animations.play('boom');
  }, this);
}