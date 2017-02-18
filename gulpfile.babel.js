/*jshint strict:false*/
'use strict';

import gulp            from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import bs              from 'browser-sync';
import del             from 'del';
import bourbon         from 'node-bourbon';

const $ = gulpLoadPlugins();


// ========>> GULP PLUGIN LIST <<========

gulp.task('pl', () => console.log($));



// ========>> INCLUDED ELEMENTS <<========
// comment lines, which elements should be excluded

const WIDGETS = {
	css: [
		'src/sass/accordion.sass', // accordion
	],
	js: [
		'src/js/dev/accordion.js',	// accordion
	]
};

// ========>> LIVERELOAD <<========

gulp.task('browser-sync', () => {
	bs({
		server: {
			baseDir: 'src'
		},
		browser: 'chrome',
		notify: false
	});
});


// ========>> CSS <<========


gulp.task('sass', ['sass-main'], () => {
	return gulp.src(WIDGETS.css)
	.pipe($.sass({
		includePaths: bourbon.includePaths
	}).on('error', $.sass.logError))
	.pipe($.autoprefixer(['last 3 versions']))
	.pipe($.concat('widgets.css'))
	.pipe(gulp.dest('src/css'))
	.pipe($.cleanCss())
	.pipe($.rename({suffix: '.min', prefix : ''}))
	.pipe(gulp.dest('src/css'))
	.pipe(bs.reload({stream: true}))
});

gulp.task('sass-main', () => {
	return gulp.src('src/sass/components/main.sass')
	.pipe($.sass({
		includePaths: bourbon.includePaths
	}).on('error', $.sass.logError))
	.pipe($.autoprefixer(['last 3 versions']))
	.pipe($.cleanCss())
	.pipe($.rename({suffix: '.min', prefix : ''}))
	.pipe(gulp.dest('src/css'))
	.pipe(bs.reload({stream: true}))
}); 

// ========>> JS <<========

gulp.task('js', () => {
	return gulp.src(WIDGETS.js)
	.pipe($.babel())
	.pipe($.concat('widgets.js'))
	.pipe(gulp.dest('src/js'))
	.pipe($.uglify())
	.pipe($.rename({suffix: '.min', prefix : ''}))
	.pipe(gulp.dest('src/js'))
	.pipe(bs.reload({stream: true}))
});


// ========>> WATCH <<========

gulp.task('watch', ['sass', 'browser-sync', 'js'],() => {
	gulp.watch('src/**/*.{sass,scss}', ['sass']);
	gulp.watch('src/*.html', bs.reload);
	gulp.watch('src/js/dev/*.js', ['js']);
});


// ========>> BUILD <<========

gulp.task('removedist', () => { return del.sync('dist'); });

gulp.task('build', ['removedist','sass', 'js'], () => {
	var buildHtml = gulp.src('src/index.html').pipe(gulp.dest('dist'));
	var buildCss = gulp.src('src/css/*.css').pipe(gulp.dest('dist/css'));
	var buildJs  = gulp.src('src/js/*.js').pipe(gulp.dest('dist/js'));
});


// ========>> DEFAULT <<========

gulp.task('clearcache', () => { return $.cache.clearAll(); });

gulp.task('default', ['watch']);



