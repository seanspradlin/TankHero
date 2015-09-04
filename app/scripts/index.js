'use strict';

var game = new Phaser.Game(1200, 800, Phaser.AUTO, 'game');
game.state.add('main', MainState);
game.state.start('main');