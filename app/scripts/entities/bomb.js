'use strict';
Bomb.prototype = Object.create(Phaser.Sprite.prototype);
Bomb.prototype.constructor = Shell;

function Bomb(game) {
  Phaser.Sprite.call(this, game, 0, 0, 'sprites', 'bomber/bomb');
  this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
  this.anchor.x = 0.5;
  this.anchor.y = 1.0;
  this.tracking = false;
  this.scaleSpeed = 0;
  this.exists = false;
  this.alive = false;

  // Physics
  game.physics.enable(this);
  this.body.gravity.y = 750;
  this.outOfBoundsKill = true;
  this.checkWorldBounds = true;

  this.events.onKilled.add(function() {
    Pool(game, false).bombExplosions.getFirstExists(false).bang(this.x, this.y - 4);
  }, this);
}