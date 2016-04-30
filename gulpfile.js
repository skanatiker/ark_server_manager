var gulp = require('gulp')
var gutil = require('gulp-util')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var ngAnnotate = require('gulp-ng-annotate')
var sourcemaps = require('gulp-sourcemaps')

gulp.task('js', function () {
    gulp.src(['src/scripts/**/module.js', 'src/scripts/**/*.js'])
        .pipe(sourcemaps.init())
        .pipe(concat('ark.js'))
        .pipe(ngAnnotate())
        .on('error', gutil.log)
        .pipe(uglify())
        .on('error', gutil.log)
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('public/scripts'))
})


gulp.task('watch', ['js'], function () {
    gulp.watch('src/scripts/**/*.js', ['js'])
})
