var through = require('through2');
var gutil = require('gulp-util');
var http = require('http');
var https = require('https');
var connect = require('connect');
var serveStatic = require('serve-static');
var connectLivereload = require('connect-livereload');
var tinyLr = require('tiny-lr');
var watch = require('node-watch');
var fs = require('fs');
var serveIndex = require('serve-index');
var path = require('path');
var enableMiddlewareShorthand = require('./enableMiddlewareShorthand');

var url = require('url')
var proxy = require('proxy-middleware')


module.exports = function(options) {

  var proxies = options.proxies;
  options.proxies = null;

  var defaults = {

    /**
     *
     * BASIC DEFAULTS
     *
     **/

    host: 'localhost',
    port: 8000,
    fallback: false,
    https: false,

    /**
     *
     * MIDDLEWARE DEFAULTS
     *
     * NOTE:
     *  All middleware should defaults should have the 'enable'
     *  property if you want to support shorthand syntax like:
     *
     *    webserver({
     *      livereload: true
     *    });
     *
     */

    // Middleware: Livereload
    livereload: {
      enable:false,
      port: 35729
    },

    // Middleware: Directory listing
    // For possible options, see:
    //  https://github.com/expressjs/serve-index
    directoryListing: {
      enable: false,
      path: './',
      options: undefined
    }

    // Middleware: Proxy
    

  };

  // Deep extend user provided options over the all of the defaults
  // Allow shorthand syntax, using the enable property as a flag
  var config = enableMiddlewareShorthand(defaults, options, ['directoryListing','livereload']);

  var app = connect();

  /*
   * proxies
   */
  if (proxies) {
    for (var i = 0, len = proxies.length; i < len; i++) {
      var p = proxies[i];
      app.use(p.source, proxy(url.parse(p.target)));

      gutil.log('...proxying ', gutil.colors.green(p.source), '-> ', gutil.colors.green(p.target));

    }
  }

  var lrServer;

  if (config.livereload.enable) {

    app.use(connectLivereload({
      port: config.livereload.port
    }));

    lrServer = tinyLr();
    lrServer.listen(config.livereload.port);

  }

  if (config.directoryListing.enable) {

      app.use(serveIndex(path.resolve(config.directoryListing.path), config.directoryListing.options));

  }

  // Create server
  var stream = through.obj(function(file, enc, callback) {

    app.use(serveStatic(file.path));

    if (config.fallback) {

      var fallbackFile = file.path + '/' + config.fallback;

      if (fs.existsSync(fallbackFile)) {

        app.use(function(req, res) {
          fs.createReadStream(fallbackFile).pipe(res);
        });

      }
    }


    if (config.livereload.enable) {

      watch(file.path, function(filename) {

        lrServer.changed({
          body: {
            files: filename
          }
        });

      });

    }

    this.push(file);

    callback();

  });

  if (config.https) {
    var options = {
      key: fs.readFileSync(config.https.key || __dirname + '/../ssl/dev-key.pem'),
      cert: fs.readFileSync(config.https.cert || __dirname + '/../ssl/dev-cert.pem')
    };
    var webserver = https.createServer(options, app).listen(config.port, config.host);
  }
  else {
    var webserver = http.createServer(app).listen(config.port, config.host);
  }

  gutil.log('My Webserver started at', gutil.colors.cyan('http' + (config.https ? 's' : '') + '://' + config.host + ':' + config.port));

  stream.on('kill', function() {

    webserver.close();

    if (config.livereload.enable) {
      lrServer.close();
    }

  });

  return stream;

};
