'use strict';
var States = States || {}
  , Main   = new Phaser.State();

Main.create = function() {
  console.log('Game has begun');
  this.add.existing(new Jeep(Main.game, 150, 150));
};

States.Main = Main;