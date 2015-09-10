'use strict';

Bomber.prototype = Object.create(Phaser.Sprite.prototype);
Bomber.prototype.constructor = Bomber;

function Bomber(game, x, y) {

  // Properties
  this.firingDelay = 3000;
  this.nextFire = 0;
  this.moveSpeed = 30;
  
  // Call base constructor
  Phaser.Sprite.call(this, game, x, y, 'sprites', 'bomber/body');

  // Propeller
  var propeller = new Phaser.Sprite(this.game, 8, 47, 'sprites', 'bomber/propeller1');
  propeller.anchor.x = 1.0;
  propeller.anchor.y = 0.5;
  var spinningFrames = Phaser.Animation.generateFrameNames('bomber/propeller', 1, 4);
  propeller.animations.add('spinning', spinningFrames, 30, true, false);
  propeller.animations.play('spinning');
  this.addChild(propeller);
}