'use strict';

Jeep.prototype = Object.create(Phaser.Sprite.prototype);
Jeep.prototype.constructor = Jeep;

function Jeep(game, moveSpeed, firingDelay) {

  this.nextFire = 0;
  this.firingDelay = firingDelay;
  this.moveSpeed = moveSpeed;

  // Call base constructor
  Phaser.Sprite.call(this, game, 0, 0, 'sprites', 'jeep/body1');

  // Animations
  var drivingFrames = Phaser.Animation.generateFrameNames('jeep/body', 6, 1);
  this.animations.add('driving', drivingFrames, 8, true, false);
  this.animations.play('driving');

  // Anchor
  this.anchor.x = 0.5;
  this.anchor.y = 1.0;

  // Driver
  var driver = new Phaser.Sprite(this.game, -12, -16, 'sprites', 'jeep/driver');
  driver.anchor.x = 0.5;
  driver.anchor.y = 1.0;
  this.addChild(driver);

  // Grenadier
  var grenadier = new Phaser.Sprite(this.game, -2, -16, 'sprites', 'jeep/grenadier');
  grenadier.anchor.x = 0.5;
  grenadier.anchor.y = 1.0;
  this.addChild(grenadier);

  this.scale.x = 3;
  this.scale.y = 3;
}

Jeep.prototype.forward = function () {
  this.game.physics.arcade.moveToXY(this, 0, this.game.height, this.moveSpeed);
};

Jeep.prototype.attack = function() {

};