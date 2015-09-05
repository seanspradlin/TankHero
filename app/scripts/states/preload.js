'use strict';
var States  = States || {}
  , Preload = new Phaser.State();

Preload.preload = function() {
  console.log('Loading game assets');
};

Preload.create = function() {
  console.log('Preload complete, jump to Menu');
  Preload.game.state.start('Menu');
};

States.Preload = Preload;