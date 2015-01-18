var 	gulp = require('gulp'),
			sass = require('gulp-sass'),
			jshint = require('gulp-jshint'),
			stylish = require('jshint-stylish'),
			concat = require('gulp-concat'),
			uglify = require('gulp-uglify'),
			rename = require('gulp-rename'),
			browserSync = require('browser-sync'),
			autoprefixer = require('gulp-autoprefixer'),
			minifyCSS = require('gulp-minify-css');

// Static server
gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: "app"
		},
		port: 8080
	});
});

gulp.task('js', function() {
	return gulp.src('_build/js/**')
		.pipe(jshint())
		.pipe(jshint.reporter(stylish))
		// .pipe(concat('site.js'))
		//.pipe(uglify())
		.pipe(gulp.dest('app/js/'))
		//.pipe(connect.reload());
		.pipe(browserSync.reload({stream:true}));
});

gulp.task('scss', function() {
	return gulp.src('_build/scss/style.scss')
		.pipe(sass())
		.pipe(autoprefixer({
			browsers: ['last 2 versions', 'ie >= 8'],
			cascade: false
		}))
		.pipe(minifyCSS())
		.pipe(gulp.dest('app/css/'))
		.pipe(browserSync.reload({stream:true}));
});

gulp.task('html', function() {
	gulp.src('_build/html/**')
		.pipe(gulp.dest('app'))
		.pipe(browserSync.reload({stream:true}));
});

gulp.task('watch', function() {
	gulp.watch('_build/js/**', ['js']);
	gulp.watch('_build/scss/**', ['scss']);
	gulp.watch('_build/html/**', ['html']);
});

gulp.task('default', []);

gulp.task('serve', ['build', 'browser-sync'], function() {
	gulp.watch('_build/js/**', ['js']);
	gulp.watch('_build/scss/**', ['scss']);
	gulp.watch('_build/html/**', ['html']);
});

gulp.task('build', ['scss', 'js', 'html']);
