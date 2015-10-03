'use strict';
Healthbar.prototype = Object.create(Phaser.Sprite.prototype);
Healthbar.prototype.constructor = Bomb;

function Healthbar(game) {
  Phaser.Sprite.call(this, game, 25, 250, 'sprites', 'hp/bar');

  var fill = game.add.sprite(3, 184, 'sprites', 'hp/pip');
  this.fill = this.addChild(fill);

  this.fill.height = -20*5;
}

Healthbar.prototype.setHealth = function(health) {
  this.fill.height = -5 * health;
};