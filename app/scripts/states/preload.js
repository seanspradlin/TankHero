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
  this.load.audio('fire', 'assets/sounds/fire.wav');
  this.load.audio('panther-fire', 'assets/sounds/panther-fire.wav');
  this.load.audio('panther-explosion', 'assets/sounds/panther-explosion.wav');
  this.load.audio('jeep-grenade', 'assets/sounds/jeep-grenade.wav');
  this.load.audio('jeep-explosion', 'assets/sounds/jeep-explosion.wav');
  this.load.audio('bomb', 'assets/sounds/bomb.wav');
};

Preload.create = function() {
  console.log('Preload complete, jump to Menu');
  this.state.start('Menu');
};

States.Preload = Preload;