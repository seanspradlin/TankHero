'use strict';
Medkit.prototype = Object.create(Phaser.Sprite.prototype);
Medkit.prototype.constructor = Medkit;

function Medkit(game) {
  Phaser.Sprite.call(this, game, 0, 0, 'sprites', 'biplane/crate');
  this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
  this.anchor.x = 0.5;
  this.anchor.y = 1.0;
  this.tracking = false;
  this.scaleSpeed = 0;
  this.scale.x = 1.2;
  this.scale.y = 1.2;
  this.exists = false;
  this.alive = false;

  game.physics.enable(this);
  this.body.gravity.y = 500;
  this.checkWorldBounds = true;
  this.body.collideWorldBounds = true;
}