'use strict';
var States  = States || {}
  , Menu    = new Phaser.State();

Menu.create = function() {
  this.stage.backgroundColor = '#333333';

  // Input
  this.keyboard = this.input.keyboard.createCursorKeys();
  this.keyboard.attack = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  var text1 = this.add.text(512, 334,
              'Arrow Keys to Move, Spacebar to Shoot',
              {font: '32px Arial', fill: '#ffffff', align: 'center'});
  text1.anchor.x = 0.5;
  text1.anchor.y = 0.5;

  var text2 = this.add.text(512, 484,
              'Press Spacebar to begin',
              {font: '16px Arial', fill: '#ffffff', align: 'center'});
  text2.anchor.x = 0.5;
  text2.anchor.y = 0.5;

  console.log('Menu loaded');
};

Menu.update = function() {
  if (this.keyboard.attack.isDown) {
    console.log('Starting game');
    this.state.start('Main');
  }
};

States.Menu = Menu;