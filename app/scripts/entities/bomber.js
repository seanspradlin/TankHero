'use strict';

Bomber.prototype = Object.create(Phaser.Sprite.prototype);
Bomber.prototype.constructor = Bomber;

function Bomber(game, x, y) {

  // Properties
  this.firingDelay = 3000;
  this.nextFire = 0;
  this.moveSpeed = 45;

  // Call base constructor
  Phaser.Sprite.call(this, game, x, y, 'sprites', 'bomber/body');

  // Enable physics
  this.game.physics.enable(this);
  this.body.collideWorldBounds = false;
  this.body.allowGravity = false;
  this.outOfBoundsKill = true;
  this.checkWorldBounds = true;

  // Propeller
  var propeller = new Phaser.Sprite(this.game, 8, 47, 'sprites', 'bomber/propeller1');
  propeller.anchor.x = 1.0;
  propeller.anchor.y = 0.5;
  var spinningFrames = Phaser.Animation.generateFrameNames('bomber/propeller', 1, 4);
  propeller.animations.add('spinning', spinningFrames, 30, true, false);
  propeller.animations.play('spinning');
  this.addChild(propeller);

  this.exists = false;
}

Bomber.prototype.forward = function () {
  var x = this.scale.x < 0 ? this.game.width * 1.5 : this.game.width * -0.5;
  this.game.physics.arcade.moveToXY(this, x, this.y, this.moveSpeed);
};

Bomber.prototype.attack = function () {
  if (this.game.time.time < this.nextFire) { return; }

  var bomb  = Pool(this.game).bombs.getFirstExists(false)
    , scale = this.scale.x
    , flip  = this.scale.x < 0
    , x     = flip ? this.x - 95 : this.x + 95
    , y     = this.y + 75;

  bomb.scale.x = scale;

  this.nextFire = this.game.time.time + this.firingDelay;
  bomb.reset(x, y);
};