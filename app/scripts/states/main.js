'use strict';
var States = States || {}
  , Main   = new Phaser.State();

Main.create = function() {
  console.log('Game has begun');
  this.add.sprite(100, 100, 'sprites', 'jeep/body1');
};

States.Main = Main;