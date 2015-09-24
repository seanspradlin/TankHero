'use strict';
Panther.prototype = Object.create(Phaser.Sprite.prototype);
Panther.prototype.constructor = Panther;

function Panther(game, moveSpeed, firingDelay, rangeFromPlayer) {

  // Properties
  this.nextFire = 0;
  this.firingDelay = firingDelay;
  this.moveSpeed = moveSpeed;
  this.rangeFromPlayer = rangeFromPlayer;
  this.health = 6;
  this.scoreValue = 5;

  // Call base constructor
  Phaser.Sprite.call(this, game, 0, 0, 'sprites', 'panther/body1');

  // Physics
  this.game.physics.enable(this);
  this.body.collideWorldBounds = true;

  // Animations
  var forwardFrames = Phaser.Animation.generateFrameNames('panther/body', 4, 1);
  this.animations.add('forward', forwardFrames, 8, true, false);

  var reverseFrames = Phaser.Animation.generateFrameNames('panther/body', 1, 4);
  this.animations.add('reverse', reverseFrames, 8, true, false);

  // Anchor
  this.anchor.x = 0.5;
  this.anchor.y = 1.0;

  // Cannon
  var cannon = new Phaser.Sprite(this.game, -27, -44, 'sprites', 'panther/cannon1');
  var firingFrames = Phaser.Animation.generateFrameNames('panther/cannon', 1, 4);
  cannon.anchor.x = 1.0;
  cannon.anchor.y = 0.5;
  cannon.animations.add('firing', firingFrames, 10, false, false);
  cannon.events.onAnimationComplete.add(function () {
    this.cannon.animations.previous(firingFrames.length);
  }, this);
  this.cannon = this.addChild(cannon);


  this.scale.x = 2.0;
  this.scale.y = 2.0;

  this.exists = false;
  this.alive = false;
}

Panther.prototype.forward = function () {
  this.animations.play('forward');
  this.game.physics.arcade.moveToXY(this, 0, this.game.height, this.moveSpeed);
};

Panther.prototype.reverse = function () {
  this.animations.play('reverse');
  this.game.physics.arcade.moveToXY(this, this.game.width, this.game.height, this.moveSpeed);
};

Panther.prototype.halt = function() {
  this.animations.stop();
  this.game.physics.arcade.moveToXY(this, this.x, this.game.height, this.moveSpeed);
};

Panther.prototype.attack = function () {
  if (this.game.time.time < this.nextFire) { return; }
  var pool = Pool(this.game);
  if (pool.pantherShells.countDead() === 0) { return; }

  var shell = pool.pantherShells.getFirstExists(false)
    , x     = this.cannon.world.x + this.cannon.width * -1
    , y     = this.cannon.world.y;

  shell.reset(x, y);
  this.game.physics.arcade.velocityFromAngle(-180, 900, shell.body.velocity);

  this.cannon.animations.play('firing');
  this.nextFire = this.game.time.time + this.firingDelay;
};