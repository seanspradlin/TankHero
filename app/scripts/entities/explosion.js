'use strict';
Explosion.prototype = Object.create(Phaser.Sprite.prototype);
Explosion.prototype.constructor = Explosion;

function Explosion(game, frames, fps) {
  // Call base constructor
  Phaser.Sprite.call(this, game, 0, 0, 'sprites', 'explosion/1');

  // Animations
  this.animations.add('boom', frames, fps, false, false);

  this.anchor.x = 0.5;
  this.anchor.y = 0.5;

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