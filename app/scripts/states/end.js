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
              'SCORE: ' + totalKills,
              {font: '16px Arial', fill: '#ffffff', align: 'center'});
  text2.anchor.x = 0.5;
  text2.anchor.y = 0.5;

  var fill = Scoreboard.isBest(totalKills) ? '#ff0000' : '#ffffff';
  var text3 = this.add.text(this.game.width / 2, (this.game.height /2) + 200,
              'PERSONAL BEST: ' + Scoreboard.personalBest(),
              {font: '16px Arial', fill: fill, align: 'center'});
  text3.anchor.x = 0.5;
  text3.anchor.y = 0.5;

  if (Scoreboard.compare(totalKills)) {
    document.getElementById('record').style.visibility = 'visible';
  }

  this.game.sound.play('game-over');
};

End.update = function() {
  if (this.game.time.time < this.restartTime) { return; }
  this.state.start('Menu');
};

States.End = End;