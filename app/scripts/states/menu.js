'use strict';
var States = States || {}
  , Menu = new Phaser.State();

Menu.create = function () {
  this.stage.backgroundColor = '#333333';

  var logo = Boot.add.image(Boot.game.width / 2, Boot.game.height / 2, 'fullscreen', 'game-start');
  logo.anchor.x = 0.5;
  logo.anchor.y = 0.5;

  // Input
  this.keyboard = this.input.keyboard.createCursorKeys();
  this.keyboard.attack = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  var fontOptions = {
    font: '42px Arial',
    fill: '#900',
    fontWeight: 'bold',
    stroke: '#ddd',
    strokeThickness: 5,
    align: 'center',
  };
  var text = this.add.text(512, 384, 'Press Spacebar to Begin', fontOptions);
  text.anchor.x = 0.5;
  text.anchor.y = 0.5;

  console.log('Menu loaded');
};

Menu.update = function () {
  if (this.keyboard.attack.isDown) {
    console.log('Starting game');
    this.state.start('Main');
  }
};

States.Menu = Menu;