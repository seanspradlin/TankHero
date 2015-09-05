'use strict';
var States = States || {}
  , Main   = new Phaser.State()
  , ground, fog1, fog2;
var explode;
Main.create = function() {
  // Background
  this.add.image(0, 0, 'environment', 'sky').height = this.game.height;
  var trees1 = Main.add.image(0,this.game.height - 10, 'environment', 'trees1');
  trees1.width = Main.game.width;
  trees1.alpha = 0.3;
  trees1.anchor.y = 1.0;
  var trees2 = Main.add.image(0,Main.game.height - 20, 'environment', 'trees2');
  trees2.width = Main.game.width;
  trees2.alpha = 0.2;
  trees2.anchor.y = 1.0;

  // Fog 1
  fog1 = Main.add.tileSprite(0, Main.game.height, 2400, 400, 'environment', 'dust1');
  fog1.anchor.y = 1.0;
  fog1.alpha = 0.5;

  // Ground
  ground = this.add.sprite(0, this.game.height, 'environment', 'ground');
  ground.width = this.game.width;
  ground.anchor.y = 1.0;

  // Fog 2
  fog2 = Main.add.tileSprite(0, Main.game.height, 2400, 400, 'environment', 'dust2');
  fog2.anchor.y = 1.0;
  fog2.alpha = 0.5;

  //this.add.existing(new Jeep(Main.game, 150, 150));
  //this.add.existing(new Explosion(Main.game, 150, 150));

  console.log('Game has begun');
};

Main.update = function() {
  fog1.x -= 0.5;
  fog2.x -= 1;
};

States.Main = Main;