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
			mustache = require("gulp-mustache-plus"),
			child_process = require('child_process'),
			path = require('path'),
			//ingestVideo = require('./gulp/ingest_video'),
			videoConverter = require('./gulp/convert_video')
			symlink = require('gulp-symlink');

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
		port: 8081
	});
});

gulp.task('set-env-global', function () {
	return env({
		file: 'config/config.global.js'
	});

});

gulp.task('set-env-dev', ['set-env-global'], function () {
	return env({
		vars: {
			production: false,
			target: 'targets/dev'
		},
		file: 'config/config.dev.js'
	});
});

gulp.task('set-env-deploy', ['set-env-global'], function () {
	return env({
		vars: {
			production: true,
			target: 'targets/deploy'
		},
		file: 'config/config.deploy.js'
	});
});

gulp.task('js', function() {
	return gulp.src('_build/js/*.js')
		.pipe(browserify({
			debug: true,
			transform: ['envify']
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
		.pipe(mustache(process.env, {
			extension: '.html'
		}))
		.pipe(gulp.dest(destPath('')))
		.pipe(browserSync.reload({stream:true}));
});

gulp.task('img', function () {
	return gulp.src('_build/img/**')
		.pipe(gulp.dest(destPath('img')));
});

gulp.task('ingest-video', function () {
	return gulp.src('videos/master/*')
		.pipe(ingestVideo({
			appName: process.env.appName
		}))
		.pipe(gulp.dest('videos/ingested'));
});

gulp.task('convert-video-mobile', function () {
	// Convert video/audio separately
	gulp.src('videos/ingested/*', {
		buffer: false
	})
		.pipe(videoConverter.mobileAudio())
		.pipe(gulp.dest('videos/mobile/'));

	gulp.src('videos/ingested/*', {
		buffer: false
	})
		.pipe(videoConverter.mobileVideo({
			tmpDir: './tmp'
		}))
		.pipe(gulp.dest('videos/mobile'));
});

gulp.task('convert-video-desktop', function () {
	return gulp.src('videos/ingested/*')
		.pipe(gulp.dest('videos/desktop'));
});

gulp.task('symlink-video', function() {
  return gulp.src(['videos/desktop/', 'videos/mobile/'])
    .pipe(symlink([destPath('video/desktop'), destPath('video/mobile')], {
    	force: true
    }));
});

gulp.task('default', []);

gulp.task('serve', ['build-dev', 'browser-sync'], function() {
	//child_process.fork('server/app.js', {cwd: './'});

	gulp.watch('_build/js/**', ['js']);
	gulp.watch('_build/scss/**', ['scss']);
	gulp.watch('_build/html/**', ['html']);
});

gulp.task('deploy', ['build-deploy'], function () {
	var aws = require('./config/credentials').aws;

	// child_process.execFile('./scripts/deploy_remote.sh', [process.env.remote_server], function (err, stdout, stderr) {
	// 	stdout && console.log(stdout);
	// 	stderr && console.error(stderr);
	// });

	return gulp.src(destPath('/**/*'))
			.pipe(s3(aws, {
				uploadPath: '/static/'
			}));
});

gulp.task('build-dev', ['set-env-dev', 'scss', 'js', 'html', 'img']);
gulp.task('build-deploy', ['set-env-deploy', 'scss', 'js', 'html', 'img']);
gulp.task('build', ['build-dev']);
gulp.task('convert-video', ['convert-video-desktop', 'convert-video-mobile']);
