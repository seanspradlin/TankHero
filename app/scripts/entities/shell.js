'use strict';
Shell.prototype = Object.create(Phaser.Sprite.prototype);
Shell.prototype.constructor = Shell;

function Shell(game) {
  Phaser.Sprite.call(this, game, 0, 0, 'sprites', 'player/shell');
  this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
  this.anchor.set(0.5);
  this.outOfBoundsKill = true;
  this.checkWorldBounds = true;
  this.tracking = false;
  this.scaleSpeed = 0;
  this.scale.x = 2;
  this.scale.y = 2;
  this.exists = false;

  this.events.onKilled.add(function() {
    // play explosion
  }, this);
}