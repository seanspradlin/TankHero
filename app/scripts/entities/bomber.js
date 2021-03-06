'use strict';

Bomber.prototype = Object.create(Phaser.Sprite.prototype);
Bomber.prototype.constructor = Bomber;

function Bomber(game, x, y) {

  // Properties
  this.firingDelay = 100;
  this.nextFire = 0;
  this.moveSpeed = 450;

  // Call base constructor
  Phaser.Sprite.call(this, game, x, y, 'sprites', 'bomber/body');

  // Enable physics
  this.game.physics.enable(this);
  this.body.allowGravity = false;
  this.checkWorldBounds = true;
  this.outOfBoundsKill = true;

  // Propeller
  var propeller = new Phaser.Sprite(this.game, 8, 47, 'sprites', 'bomber/propeller1');
  propeller.anchor.x = 1.0;
  propeller.anchor.y = 0.5;
  var spinningFrames = Phaser.Animation.generateFrameNames('bomber/propeller', 1, 4);
  propeller.animations.add('spinning', spinningFrames, 30, true, false);
  propeller.animations.play('spinning');
  this.addChild(propeller);

  this.exists = false;
  this.alive = false;
}

Bomber.prototype.forward = function () {
  var x = this.scale.x < 0 ? this.game.width * 2.5 : this.game.width * -2.5;
  this.game.physics.arcade.moveToXY(this, x, this.y, this.moveSpeed);
};

Bomber.prototype.attack = function () {
  if (this.game.time.time < this.nextFire) { return; }
  if (this.x > Main.player.x + 50 || this.x < Main.player.x - 50) { return; }
  var pool  = Pool(this.game, false);
  if (pool.bombs.countDead() === 0) { return; }
  var bomb  = pool.bombs.getFirstExists(false)
    , scale = this.scale.x
    , flip  = this.scale.x < 0
    , x     = flip ? this.x - 95 : this.x + 95
    , y     = this.y + 75;

  bomb.scale.x = scale;

  this.nextFire = this.game.time.time + this.firingDelay;
  bomb.reset(x, y);
};