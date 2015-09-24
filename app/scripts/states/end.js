'use strict';
var States  = States || {}
  , End    = new Phaser.State();

End.create = function() {
  console.log('Game Over');
  this.stage.backgroundColor = '#333333';
  this.restartTime = this.game.time.time + 7000;

  var text1 = this.add.text(512, 335,
              'GAME OVER',
              {font: '32px Arial', fill: '#ffffff', align: 'center'});
  text1.anchor.x = 0.5;
  text1.anchor.y = 0.5;

  var text2 = this.add.text(this.game.width / 2, (this.game.height /2) + 100,
              'TOTAL KILLS: ' + totalKills,
              {font: '16px Arial', fill: '#ffffff', align: 'center'});
  text2.anchor.x = 0.5;
  text2.anchor.y = 0.5;
};

End.update = function() {
  if (this.game.time.time < this.restartTime) { return; }
  this.state.start('Menu');
};

States.End = End;