'use strict';
var GulpConfig = (function () {
    function GulpConfig() {
        this.source = './app/';
        this.build = './build/';
        this.scripts = [this.source + '/scripts/**/*.js'];
        this.vendor = [this.source + '/vendor/phaser/build/phaser.*']
    }
    return GulpConfig;
})();
module.exports = GulpConfig;