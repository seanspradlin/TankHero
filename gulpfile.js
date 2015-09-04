'use strict';

var gulp = require('gulp')
  , sourcemaps = require('gulp-sourcemaps')
  , concat = require('gulp-concat')
  , uglify = require('gulp-uglify')
  , minifyHtml = require('gulp-minify-html')
  , Config = require('./gulpfile.config')
  , config = new Config();

// Concat + Minify JS
gulp.task('js-crunch', function () {
  return gulp.src(config.scripts)
    .pipe(sourcemaps.init())
    .pipe(concat('tankhero.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.build + 'scripts/'));
});

// Minify HTML
gulp.task('html-crunch', function () {
  return gulp.src(config.source + 'index.html')
    .pipe(minifyHtml())
    .pipe(gulp.dest(config.build));
});

// Migrate phaser files
gulp.task('phaser', function () {
  return gulp.src(config.source + 'vendor/phaser/build/phaser.*')
    .pipe(gulp.dest(config.build + 'scripts/'));
});

// Assets
gulp.task('assets', function () {
  return gulp.src(config.source + 'assets/**/*.*')
    .pipe(gulp.dest(config.build + '/assets/'));
});

gulp.task('default', ['js-crunch', 'html-crunch', 'phaser', 'assets']);