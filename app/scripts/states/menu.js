'use strict';
var States = States || {}
  , Menu = new Phaser.State();

Menu.create = function () {
  this.stage.backgroundColor = '#333333';

  var logo = Boot.add.image(Boot.game.width / 2, Boot.game.height / 2, 'fullscreen', 'game-start');
  logo.anchor.x = 0.5;
  logo.anchor.y = 0.5;
  logo.height = 600;
  logo.width = 800;

  // Input
  this.keyboard = this.input.keyboard.createCursorKeys();
  this.keyboard.attack = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  console.log('Menu loaded');
};

Menu.update = function () {
  if (this.keyboard.attack.isDown) {
    console.log('Starting game');
    this.state.start('Main');
  }
};

States.Menu = Menu;