'use strict';
var config      = {};
config.source   = './app/';
config.build    = './build/';
config.scripts  = [
                    config.source + '/scripts/lib/*.js',
                    config.source + '/scripts/entities/*.js',
                    config.source + '/scripts/states/*.js',
                    config.source + '/scripts/*.js'
                  ];
config.vendor   = [config.source + '/vendor/phaser/build/phaser.*'];
module.exports  = config;