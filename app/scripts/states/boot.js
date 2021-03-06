'use strict';
var States  = States || {}
  , Boot    = new Phaser.State();

Boot.preload = function() {
  console.log('Load booting assets');
  this.load.atlasJSONHash(
    'fullscreen',
    'assets/images/fullscreens.png',
    'assets/images/fullscreens.json'
  );
};

Boot.create = function() {
  this.game.stage.scale.pageAlignHorizontally = true;
  this.game.stage.scale.pageAlignVeritcally = true;
  this.stage.backgroundColor = '#aaaaaa';
  console.log('Configuring game');

  console.log('Boot complete, jump to Preload.');
  this.state.start('Preload');
};

States.Boot = Boot;