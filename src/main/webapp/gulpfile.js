var gulp      = require('gulp');
var changed   = require('gulp-changed');
var del       = require('del');
var webserver = require('gulp-webserver');


var paths = {
  scripts: ['app/js/**/*.js'],
  images: 'app/img/**/*',
  styles: 'app/styles/**/*.scss',
  dist: 'dist',
  staticFiles: ['app/index.html', 'app/favicon.ico']
};


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
 * server
 */
gulp.task('serve', ['watch'], function() {
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
});


/*
 * build
 */
gulp.task('build', ['clean', 'images', 'static']); 


/*
 * default
 */
gulp.task('default', ['build']);