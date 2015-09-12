'use strict';
Bomb.prototype = Object.create(Phaser.Sprite.prototype);
Bomb.prototype.constructor = Shell;

function Bomb(game) {
  Phaser.Sprite.call(this, game, 0, 0, 'sprites', 'bomber/bomb');
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
    Pool(game).bombExplosions.getFirstExists(false).bang(this.x, this.y);
  }, this);
}