'use strict';

function MainState() {
	var i = 0;
	this.preload = function() {
		// TODO
	};
	this.update = function() {
		console.log(i++);
	};
}