var gulp        = require('gulp');
var changed     = require('gulp-changed');
var del         = require('del');
var webserver   = require('gulp-webserver');
var gutil       = require('gulp-util');
var browserify  = require('gulp-browserify');
var uglify      = require('gulp-uglify');
var gulpif      = require('gulp-if');


var paths = {
  bundle: 'app/js/app.js',
  scripts: ['app/js/**/*.js', 'app/js/**/*.jsx'],
  images: 'app/img/**/*',
  styles: 'app/styles/**/*.scss',
  dist: 'dist',
  staticFiles: ['app/index.html', 'app/favicon.ico']
};


var real_build = false;


gulp.task('clean', function(cb) {
  // You can use multiple globbing patterns as you would with `gulp.src`
  del([paths.dist], cb);
});


/*
 * images
 */
gulp.task('images', [], function() {
  var dest = paths.dist + '/img';

  return gulp.src(paths.images)
    .pipe(changed(dest))
    // Pass in options to the task
//    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest(dest));
});

/*
 * static ressources
 */
gulp.task('static', [], function() {
  var dest = paths.dist;

  return gulp.src(paths.staticFiles)
    .pipe(changed(dest))
    .pipe(gulp.dest(dest));
}); 

/*
 * static ressources
 */
gulp.task('scripts', function() {
  return gulp.src(paths.bundle, {read: false})
    .pipe(browserify({
      insertGlobals : false,
      transform: ['reactify'],
      extensions: ['.jsx'],
      debug: !real_build,
    }))
    .pipe(gulpif(real_build, uglify({
      mangle: {
        except: ['require', 'export', '$super']
      }
    })))
    .pipe(gulp.dest(paths.dist + '/js'));
});

/*
 * server
 */
gulp.task('serve', ['build', 'watch'], function() {
  gulp.src(paths.dist)
    .pipe(webserver({
      host: "0.0.0.0",
      port: 9000,
      livereload: true,
      directoryListing: false,
      fallback: 'index.html'
    }));
});


/*
 * Rerun the task when a file changes
 */
gulp.task('watch', function() {
  gulp.watch(paths.staticFiles, ['static']);
  gulp.watch(paths.images, ['images']);
  gulp.watch(paths.scripts, ['scripts']);
});


/*
 * build
 */
gulp.task('build', ['scripts', 'images', 'static']); 

/*
 * build
 */
gulp.task('prepare_build', [], function() {
  real_build = true;
}); 

/*
 * default
 */
gulp.task('default', ['prepare_build','build']);