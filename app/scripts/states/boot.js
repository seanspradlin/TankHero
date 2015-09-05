'use strict';
var States  = States || {}
  , Boot    = new Phaser.State();

Boot.preload = function() {
  console.log('Load booting assets');
};

Boot.create = function() {
  console.log('Configuring game');
  
  console.log('Boot complete, jump to Preload.');
  Boot.game.state.start('Preload');
};

States.Boot = Boot;