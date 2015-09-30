'use strict';

Jeep.prototype = Object.create(Phaser.Sprite.prototype);
Jeep.prototype.constructor = Jeep;

function Jeep(game, moveSpeed, firingDelay) {

  this.nextFire = 0;
  this.firingDelay = firingDelay;
  this.moveSpeed = moveSpeed;
  this.health = 1;
  this.scoreValue = 2;

  // Call base constructor
  Phaser.Sprite.call(this, game, 0, 0, 'sprites', 'jeep/body1');

  // Physics
  this.game.physics.enable(this);
  this.body.collideWorldBounds = true;
  this.body.setSize(75, 50);

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

  this.scale.x = 2;
  this.scale.y = 2;

  this.exists = false;
  this.alive = false;

  this.events.onKilled.add(function() {
    Pool(this.game, false).jeepExplosions.getFirstExists(false).bang(this.x - 16, this.y + 1);
    this.game.sound.play('jeep-explosion');
  }, this);
}

Jeep.prototype.forward = function () {
  var x = this.game.width * -2.5
    , y = this.game.height;
  this.game.physics.arcade.moveToXY(this, x, y, this.moveSpeed);
};

Jeep.prototype.attack = function() {
  if (this.game.time.time < this.nextFire) { return ; }
  var pool = Pool(this.game, false);
  if (pool.grenades.countDead() === 0) { return; }
  var grenade = pool.grenades.getFirstExists(false)
    , angle = 220
    , x = this.x - 50
    , y = this.y - 50;
  this.nextFire = this.game.time.time + this.firingDelay;
  grenade.reset(x, y);

  this.game.physics.arcade.velocityFromAngle(angle, 450, grenade.body.velocity);
};