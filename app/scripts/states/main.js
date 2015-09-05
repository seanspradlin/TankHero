'use strict';
var States = States || {}
  , Main   = new Phaser.State();

Main.create = function() {
  console.log('Game has begun');
};

States.Main = Main;