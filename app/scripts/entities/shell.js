'use strict';
Shell.prototype = Object.create(Phaser.Sprite.prototype);
Shell.prototype.constructor = Shell;

function Shell(game, key, explode) {
  Phaser.Sprite.call(this, game, 0, 0, 'sprites', key);
  this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
  this.anchor.set(0.5);
  this.tracking = false;
  this.scaleSpeed = 0;
  this.scale.x = 2;
  this.scale.y = 2;
  this.exists = false;
  this.alive = false;
  this.outOfBoundsKill = true;
  this.checkWorldBounds = true;

  if (explode) {
    this.events.onKilled.add(function() {
      Pool(game, false).blasts.getFirstExists(false).bang(this.x, this.y);
      game.sound.play('jeep-grenade');
    }, this);
  }
}