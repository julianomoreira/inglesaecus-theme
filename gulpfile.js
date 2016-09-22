var gulp = require('gulp');
var $    = require('gulp-load-plugins')();
var browserSync = require('browser-sync');

// Sass config and paths
var sassConfig = {
  sassPaths: {
    outputStyle: 'nested',
    includePaths: [
      'bower_components/foundation-sites/scss',
      'bower_components/motion-ui/src'
    ],
    errLogToConsole: true,
    outFile: './maps',
    precision: 8
  }
}
// CONFIG OBJECTS, here because they're shared across tasks
var autoprefixerConfig = {
  browsers: ['last 3 versions'], // , 'ie 8', 'ie 9'
  map: true
};

gulp.task('sass', function() {
  return gulp
    .src('src/scss/**/*.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass(sassConfig.sassPaths)
    .on('error', $.sass.logError))
    .pipe($.autoprefixer(autoprefixerConfig))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('dist/css'))
    .pipe($.cssmin({keepSpecialComments: '1'}))
    .pipe(gulp.dest('./'))
    .pipe($.notify({message: 'Styles are complete'}))
    // .pipe($.livereload());
    .pipe(browserSync.stream());
});

gulp.task('default', ['sass'], function() {
    // Create LiveReload server
  $.livereload.listen();

  // Watch any files in dist/, reload on change
  gulp.watch( './**/*.html' ).on( 'change', function( file ) {
    // reload browser whenever any PHP file changes
    $.livereload.changed( file );
  });
  gulp.watch(['src/scss/**/*.scss'], ['sass']);
});

gulp.task('serve', ['sass'], function() {
    // Create LiveReload server
  browserSync.create();
  browserSync.init({
    server: {
      baseDir:'./'
    }
  });

  gulp.watch(['src/scss/**/*.scss'], ['sass']);
});
