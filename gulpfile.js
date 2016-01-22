"use strict";
let gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    preprocess = require('gulp-preprocess');

gulp.task('minify', () => {
    return gulp.src('index.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(preprocess({
            context: {
                NODE_ENV: 'production'
            }
        }))
        .pipe(rename('urltils.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(''));
});
