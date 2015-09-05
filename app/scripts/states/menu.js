'use strict';
var States  = States || {}
  , Menu    = new Phaser.State();

Menu.create = function() {
  console.log('Menu loaded');
  this.startGame();
};

Menu.startGame = function() {
  console.log('Starting game');
  this.state.start('Main');
};

States.Menu = Menu;