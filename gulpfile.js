var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jshintReporter = require('jshint-stylish');
var watch = require('gulp-watch');
var shell = require('gulp-shell');

var sass = require('gulp-sass');
var bs = require('browser-sync').create();
var browserify = require('browserify');
var react = require('gulp-react');

var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var webpackConfig = require("./webpack.config.js");

var paths = {
	'src': ['./models/**/*.js', './routes/**/*.js', 'keystone.js', 'package.json'],

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

gulp.task("webpack", function(callback) {
	// run webpack
	webpack({
		// configuration
	}, function(err, stats) {
		if (err) throw new gutil.PluginError("webpack", err);
		gutil.log("[webpack]", stats.toString({
			// output options
		}));
		callback();
	});
});


gulp.task("webpack-dev-server", function(callback) {
	// modify some webpack config options
	var myConfig = Object.create(webpackConfig);
	myConfig.devtool = "eval";
	myConfig.debug = true;

	// Start a webpack-dev-server
	new WebpackDevServer(webpack(myConfig), {
		publicPath: "/" + myConfig.output.publicPath,
		stats: {
			colors: true
		}
	}).listen(8080, "localhost", function(err) {
		if (err) throw new gutil.PluginError("webpack-dev-server", err);
		gutil.log("[webpack-dev-server]",
			"http://localhost:8080/webpack-dev-server/index.html");
	});
});

// gulp lint
gulp.task('lint', function() {
	gulp.src(paths.src)
		.pipe(jshint())
		.pipe(jshint.reporter(jshintReporter));
});

// gulp watcher for lint
gulp.task('watch:lint', function() {
	gulp.watch(paths.src, ['lint']);
});


gulp.task('watch:sass', function() {
	gulp.watch(paths.style.all, ['sass']);
});

gulp.task('sass', function() {
	gulp.src(paths.style.all)
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest(paths.style.output))
		.pipe(bs.stream());
});

// starts a production server
// runs the build task before,
// and serves the dist folder
gulp.task('serve:dist', ['build'], function() {
	browserSyncInit(paths.dist);
});

gulp.task('browser-sync', function() {
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

gulp.task('default', ['watch', 'runKeystone', 'browser-sync',
	'webpack-dev-server'
]);
