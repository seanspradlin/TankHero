'use strict';

var gulp        = require('gulp')
  , sourcemaps  = require('gulp-sourcemaps')
  , concat      = require('gulp-concat')
  , uglify      = require('gulp-uglify')
  , minifyHtml  = require('gulp-minify-html')
  , minifyCss   = require('gulp-minify-css')
  , Config      = require('./gulpfile.config');

// Concat + Minify JS
gulp.task('js-crunch', function () {
  return gulp.src(Config.scripts)
    .pipe(sourcemaps.init())
    .pipe(concat('tankhero.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(Config.build + 'scripts/'));
});

// Minify HTML
gulp.task('html-crunch', function () {
  return gulp.src(Config.source + 'index.html')
    .pipe(minifyHtml())
    .pipe(gulp.dest(Config.build));
});

// Minify CSS
gulp.task('css-crunch', function() {
  return gulp.src(Config.source + 'style.css')
    .pipe(sourcemaps.init())
    .pipe(concat('style.min.css'))
    .pipe(minifyCss())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(Config.build));
});

// Migrate phaser files
gulp.task('phaser', function () {
  return gulp.src(Config.source + 'vendor/phaser/build/phaser.*')
    .pipe(gulp.dest(Config.build + 'scripts/'));
});

// Assets
gulp.task('assets', function () {
  gulp.src(Config.source + 'favicon.ico')
    .pipe(gulp.dest(Config.build));
  return gulp.src(Config.source + 'assets/**/*.*')
    .pipe(gulp.dest(Config.build + 'assets/'));
});

// Watch
gulp.task('watch', function() {
  return gulp.watch(Config.scripts, ['js-crunch']);
});

gulp.task('default', ['js-crunch', 'html-crunch', 'css-crunch', 'phaser', 'assets']);