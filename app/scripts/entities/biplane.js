'use strict';

Biplane.prototype = Object.create(Phaser.Sprite.prototype);
Biplane.prototype.constructor = Biplane;

function Biplane(game) {
  this.nextDrop = 0;
  this.moveSpeed = 150;
  this.hasPayload = true;

  Phaser.Sprite.call(this, game, 0, 0, 'sprites', 'biplane/body');

  this.game.physics.enable(this);
  this.body.allowGravity = false;
  this.checkWorldBounds = true;
  this.outOfBoundsKill = true;
  this.scale.x = 1.2;
  this.scale.y = 1.2;
  var propeller = new Phaser.Sprite(this.game, 4, 38, 'sprites', 'biplane/propeller1');
  propeller.anchor.x = 1.0;
  propeller.anchor.y = 0.5;
  var spinningFrames = Phaser.Animation.generateFrameNames('biplane/propeller', 1, 3);
  propeller.animations.add('spinning', spinningFrames, 15, true, false);
  propeller.animations.play('spinning');
  this.propeller = this.addChild(propeller);

  this.medkit = game.add.existing(new Medkit(game));

  this.kill();
}

Biplane.prototype.forward = function() {
  this.game.physics.arcade.moveToXY(this, this.game.width * -2.5, this.y, this.moveSpeed);
};

Biplane.prototype.drop = function() {
  if (this.game.time.time < this.nextDrop) { return; }
  if (this.x > Main.player.x + 100 || this.x < Main.player.x - 100) { return; }

  if (this.hasPayload && this.alive && !this.medkit.alive) {
    this.medkit.reset(this.x + 80, this.y + 85);
    this.hasPayload = false;
  }
};