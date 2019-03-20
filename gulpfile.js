"use strict";

var gulp = require("gulp");
var istanbul = require("gulp-istanbul");
var isparta = require("isparta");
var mocha = require("gulp-mocha");
var eslint = require("gulp-eslint");
var babel = require("gulp-babel");

var config = {
  src: ["src/**/*.js"],
  test: ["test/**/*.spec.js"]
};

gulp.task("test", function() {
  return gulp.src(config.test)
    .pipe(mocha({
      useColor: true,
      reporter: "spec"
    }));
});

gulp.task("test:watch", function() {
  gulp.watch(config.test.concat(config.src), ["test"]);
});

gulp.task("lint", function() {
  return gulp.src(config.src)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});


gulp.task("coverage", function() {
  return gulp.src(config.src)
    .pipe(istanbul({
      instrumenter: isparta.Instrumenter,
      includeUntested: true
    }))
    .pipe(istanbul.hookRequire())
    .on("finish", function() {
      gulp.src(config.test)
        .pipe(mocha())
        .pipe(istanbul.writeReports());
    });
});

gulp.task("build", function () {
  return gulp.src(config.src)
    .pipe(babel())
    .pipe(gulp.dest("dist"));
});

gulp.task("default", gulp.series("test"));
