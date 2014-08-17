var gulp        = require('gulp');
var changed     = require('gulp-changed');
var del         = require('del');
var webserver   = require('./utils/gulp-webserver/src/index');
var gutil       = require('gulp-util');
var browserify  = require('browserify');
var uglify      = require('gulp-uglify');
var streamify   = require('gulp-streamify');
var gulpif      = require('gulp-if');
var watchify    = require('watchify');
var source      = require('vinyl-source-stream');
var reactify    = require('reactify');
var notify      = require('gulp-notify');
var sass        = require('gulp-ruby-sass');
var autopref    = require('gulp-autoprefixer');
var minifycss   = require('gulp-minify-css');
var open        = require("gulp-open");
var plumber     = require("gulp-plumber")
var svgSymbols  = require("gulp-svg-symbols")


var paths = {
  bundle: './app/js/app.js',
  scripts: ['app/js/**/*.js', 'app/js/**/*.jsx'],
  imageFiles: 'app/img/**/*',
  styles: 'app/styles/**/*.scss',
  dist: 'dist',
  staticFiles: ['app/index.html', 'app/favicon.ico'],
  indexHtml: "http://localhost:9000/index.html",
  icons: 'app/icons/*'
};


var real_build = true;



function handleError(task) {
  return function(err) {
    gutil.log(gutil.colors.red(err));
    notify.onError(task + ' failed, check the logs..')(err);
  };
}


gulp.task('clean', function(cb) {
  // You can use multiple globbing patterns as you would with `gulp.src`
  del([paths.dist], cb);
});


/*
 * images
 */
gulp.task('images', [], function() {
  var dest = paths.dist + '/img';

  return gulp.src(paths.imageFiles)
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
 * scripts
 */
gulp.task('scripts', function() {
  var bundler, rebundle;
  bundler = browserify({
    entries: paths.bundle,
    basedir: __dirname, 
    extensions: ['.jsx'],
    insertGlobals : false,
    debug: !real_build, 
    cache: {}, // required for watchify
    packageCache: {}, // required for watchify
    fullPaths: !real_build // required to be true only for watchify
  });
  if(!real_build) {
    bundler = watchify(bundler) 
  }
 
  bundler.transform(reactify);
 
  rebundle = function() {
    var stream = bundler.bundle();
    stream.on('error', handleError('Browserify'));
    stream = stream.pipe(source('app.js'))

    // uglify
    if(real_build) {
      stream.pipe(streamify(uglify({
        mangle: {
          except: ['require', 'export', '$super']
        }        
      })));
    }
    return stream.pipe(gulp.dest(paths.dist + '/js'));
  };
 
  bundler.on('update', rebundle);
  return rebundle();
});

/*
 * styles
 */
gulp.task('styles', function() {
  return gulp.src(paths.styles)
    .pipe(plumber())
    .pipe(sass({ style: 'expanded' }))
    .pipe(gulpif(real_build, autopref('last 2 version')))
    .pipe(gulpif(real_build, minifycss()))
    .pipe(gulp.dest(paths.dist + '/css'));
});

/*
 * icons
 */
gulp.task('icons', function() {
  return gulp.src(paths.icons)
    .pipe(plumber())
    .pipe(svgSymbols({
      svgId: "IconSvg-%f",
      className: ".IconSvg-%f",
//      fontSize: 512 // svg icons default font-size,
      css: false
    }))
    .pipe(gulp.dest(paths.dist + '/icons'));
});


/*
 * server
 */
gulp.task('serve', ['prepare_serve', 'build', 'watch'], function() {
  var options = {
    url: paths.indexHtml,
    app: "google-chrome"
  };

  gulp.src(paths.dist)
    .pipe(webserver({
      host: "0.0.0.0",
      port: 9000,
      livereload: true,
      directoryListing: true,
//      fallback: 'index.html',
      proxies: [{
        source: '/story',
        target: 'http://localhost:8080/story'
      },
      {
        source: '/query',
        target: 'http://localhost:8080/query'
      },
      {
        source: '/user',
        target: 'http://localhost:8080/user'
      },
      {
        source: '/attachment',
        target: 'http://localhost:8080/attachment'
      },
      {
        source: '/graph',
        target: 'http://localhost:8080/graph'
      },
      {
        source: '/share',
        target: 'http://localhost:8080/share'
      },
      {
        source: '/star',
        target: 'http://localhost:8080/star'
      },
      {
        source: '/due',
        target: 'http://localhost:8080/due'
      }]
    }));

    gulp.src("./app/index.html")
    .pipe(open("", options));
});

/*
 * Rerun the task when a file changes
 */
gulp.task('watch', function() {
  gulp.watch(paths.staticFiles, ['static']);
  gulp.watch(paths.imageFiles, ['images']);
  gulp.watch(paths.styles, ['styles']);
  gulp.watch(paths.icons, ['icons']);
});


/*
 * build
 */
gulp.task('build', ['scripts', 'styles', 'images', 'icons', 'static']); 

/*
 * build
 */
gulp.task('prepare_serve', [], function() {
  real_build = false;
}); 

/*
 * default
 */
gulp.task('default', ['build']);