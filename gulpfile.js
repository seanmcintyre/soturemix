var 	gulp = require('gulp'),
			sass = require('gulp-sass'),
			jshint = require('gulp-jshint'),
			stylish = require('jshint-stylish'),
			concat = require('gulp-concat'),
			uglify = require('gulp-uglify'),
			rename = require('gulp-rename'),
			browserSync = require('browser-sync'),
			autoprefixer = require('gulp-autoprefixer'),
			minifyCSS = require('gulp-minify-css'),
			browserify = require('gulp-browserify'),
			env = require('gulp-env'),
			s3 = require('gulp-s3'),
			child_process = require('child_process'),
			path = require('path');

function destPath (dir) {
	return path.join(process.env.target, dir);
}

// Static server
gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: "targets/dev"
		},
		open: false,
		port: 8080
	});
});

gulp.task('set-env-dev', function () {
	return env({
		vars: {
			production: false,
			target: 'targets/dev'
		},
		file: 'config/config.dev.json'
	});
});

gulp.task('set-env-deploy', function () {
	return env({
		vars: {
			production: true,
			target: 'targets/deploy'
		},
		file: 'config/config.deploy.json'
	});
});

gulp.task('js', function() {
	return gulp.src('_build/js/*.js')
		.pipe(browserify({
			debug: !process.env.production,
			transform: ['uglifyify', 'envify']
		}))
		.pipe(gulp.dest(destPath('js')))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('scss', function() {
	return gulp.src('_build/scss/style.scss')
		.pipe(sass())
		.pipe(autoprefixer({
			browsers: ['last 2 versions', 'ie >= 8'],
			cascade: false
		}))
		.pipe(minifyCSS())
		.pipe(gulp.dest(destPath('css')))
		.pipe(browserSync.reload({stream:true}));
});

gulp.task('html', function() {
	gulp.src('_build/html/**')
		.pipe(gulp.dest(destPath('')))
		.pipe(browserSync.reload({stream:true}));
});

gulp.task('watch', function() {
	gulp.watch('_build/js/**', ['js']);
	gulp.watch('_build/scss/**', ['scss']);
	gulp.watch('_build/html/**', ['html']);
});

gulp.task('default', []);

gulp.task('serve', ['build-dev', 'browser-sync'], function() {
	child_process.fork('app.js', {cwd: './server'});

	gulp.watch('_build/js/**', ['js']);
	gulp.watch('_build/scss/**', ['scss']);
	gulp.watch('_build/html/**', ['html']);
});

gulp.task('deploy', ['build-deploy'], function () {
	var aws = require('./config/credentials').aws;
	return gulp.src(destPath('/**/*'))
			.pipe(s3(aws));
});

gulp.task('build-dev', ['set-env-dev', 'scss', 'js', 'html']);
gulp.task('build-deploy', ['set-env-deploy', 'scss', 'js', 'html']);
gulp.task('build', ['build-dev']);
