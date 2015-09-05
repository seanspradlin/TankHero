'use strict';
var States  = States || {}
  , Preload = new Phaser.State();

Preload.preload = function() {
  console.log('Loading game assets');
  this.load.atlasJSONHash(
    'environment',
    'assets/images/environment.png',
    'assets/images/environment.json'
  );
  this.load.atlasJSONHash(
    'sprites',
    'assets/images/sprites.png',
    'assets/images/sprites.json'
  );
};

Preload.create = function() {
  console.log('Preload complete, jump to Menu');
  this.state.start('Menu');
};

States.Preload = Preload;