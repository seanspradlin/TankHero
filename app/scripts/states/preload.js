'use strict';
var States  = States || {}
  , Preload = new Phaser.State();

Preload.preload = function() {
  console.log('Loading game assets');
  var logo = this.add.image(this.game.width/2, this.game.height/2, 'fullscreen', '8bit');
  logo.anchor.x = 0.5;
  logo.anchor.y = 0.5;
  logo.height = 600;
  logo.width = 800;

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
  this.load.audio('fire', 'assets/sounds/fire.ogg');
  this.load.audio('panther-fire', 'assets/sounds/panther-fire.ogg');
  this.load.audio('panther-explosion', 'assets/sounds/panther-explosion.ogg');
  this.load.audio('jeep-grenade', 'assets/sounds/jeep-grenade.ogg');
  this.load.audio('jeep-explosion', 'assets/sounds/jeep-explosion.ogg');
  this.load.audio('bomb', 'assets/sounds/bomb.ogg');
  this.load.audio('game-start', 'assets/sounds/game-start.ogg');
  this.load.audio('game-over', 'assets/sounds/game-over.ogg');
  this.load.audio('background-music', 'assets/sounds/background.ogg');
  this.load.audio('fart', 'assets/sounds/fart.ogg');
  this.load.audio('medkit', 'assets/sounds/medkit.ogg');
  this.load.audio('groan', 'assets/sounds/groan.ogg');
};

Preload.create = function() {

  console.log('Preload complete, jump to Menu');
  this.state.start('Menu');
};

States.Preload = Preload;