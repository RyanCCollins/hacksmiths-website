var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jshintReporter = require('jshint-stylish');
var watch = require('gulp-watch');
var shell = require('gulp-shell');

var sass        = require('gulp-sass');
var bs = require('browser-sync').create();
var browserify = require('browserify');
var react = require('gulp-react');


var paths = {
	'src':['./models/**/*.js','./routes/**/*.js', 'keystone.js', 'package.json'],

      JS: ['src/js/*.js', 'src/js/**/*.js'],
      MINIFIED_OUT: 'build.min.js',
      DEST_SRC: 'dist/src',
      DEST_BUILD: 'dist/build',
      DEST: 'dist',
	'style': {
		all: './public/styles/**/*.scss',
		output: './public/styles/'
	}

};

// gulp lint
gulp.task('lint', function(){
	gulp.src(paths.src)
		.pipe(jshint())
		.pipe(jshint.reporter(jshintReporter));
});

// gulp watcher for lint
gulp.task('watch:lint', function () {
	gulp.watch(paths.src, ['lint']);
});


gulp.task('watch:sass', function () {
	gulp.watch(paths.style.all, ['sass']);
});

gulp.task('sass', function(){
    gulp.src(paths.style.all)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(paths.style.output))
    .pipe(bs.stream());
});

gulp.task('serveprod', function() {
  connect.server({
    root: [your_project_path],
    port: process.env.PORT || 4000, // localhost:4000
    livereload: false
  });
});

gulp.task('browser-sync', function(){
  bs.init({
    proxy: 'http://localhost:3000',
    port: '4000'
  });
});


gulp.task('runKeystone', shell.task('node keystone.js'));
gulp.task('watch', [

  'watch:sass',

  'watch:lint'
]);

gulp.task('default', ['watch', 'runKeystone', 'browser-sync']);
