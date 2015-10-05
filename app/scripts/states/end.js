'use strict';
var States  = States || {}
  , End    = new Phaser.State();

End.init = function(totalKills) {
  this.finalScore = totalKills;
};

End.create = function() {
  console.log('Game Over');
  this.stage.backgroundColor = '#333333';
  this.restartTime = this.game.time.time + 5000;
  Scoreboard.isBest(this.finalScore);

  var logo = Boot.add.image(Boot.game.width/2, Boot.game.height/2, 'fullscreen', 'game-over');
  logo.anchor.x = 0.5;
  logo.anchor.y = 0.5;
  logo.height = 600;
  logo.width = 800;

  var centerX = this.game.width/2
    , centerY = this.game.height/2
    , fontOptions = {
      font: '30px Arial',
      fill: '#900',
      fontWeight: 'bold',
      stroke: '#ddd',
      strokeThickness: 5,
      align: 'center',
    };

  var text1 = this.add.text(centerX, centerY + 45,
              'SCORE: ' + this.finalScore, fontOptions);
  text1.anchor.x = 0.5;
  text1.anchor.y = 0.5;

  var text2 = this.add.text(centerX, centerY + 80,
              'BEST: ' + Scoreboard.personalBest(), fontOptions);
  text2.anchor.x = 0.5;
  text2.anchor.y = 0.5;

  if (Scoreboard.compare(this.finalScore)) {
    document.getElementById('record').style.visibility = 'visible';
  }
  this.game.sound.stopAll();
  this.game.sound.play('game-over');
};

End.update = function() {
  if (this.game.time.time < this.restartTime) { return; }
  this.state.start('Menu');
};

States.End = End;