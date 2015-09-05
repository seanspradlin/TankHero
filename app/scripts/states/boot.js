'use strict';
var States  = States || {}
  , Boot    = new Phaser.State();

Boot.preload = function() {
  console.log('Load booting assets');
};

Boot.create = function() {
  this.stage.backgroundColor = '#aaaaaa';
  console.log('Configuring game');

  console.log('Boot complete, jump to Preload.');
  this.state.start('Preload');
};

States.Boot = Boot;