// My SocketStream 0.4 app

var ss = require('socketstream');
express = require('socketstream/express'),
compression = require('compression'),
favicon = require('serve-favicon'),
RedisStore = require('connect-redis'),
conventions = require('conventions'),
cookieParser = require('cookie-parser'),
path = require('path');

// Define a single-page client called 'main'
ss.client.define('main', {
  view: 'app.html',
  css:  ['../node_modules/normalize.css/normalize.css', 'app.css'],
  code: ['../node_modules/es6-shim/es6-shim.js', 'libs/jquery.min.js', 'app'],
  tmpl: 'chat'
});

// Serve this client on the root URL
ss.http.route('/', function(req, res){
  res.serveClient('main');
});

// Use server-side compiled Hogan (Mustache) templates. Others engines available
ss.client.templateEngine.use(require('ss-hogan'));

// Minimize and pack assets if you type: SS_ENV=production node app.js
if (ss.env === 'production') ss.client.packAssets();

//ss.task('application', function() {
  var app = ss.http.middleware = express();

  //express settings
  app.locals.basedir = path.join(__dirname, 'client', 'views');
  

  app.use(compression());
  app.use(favicon(ss.client.faviconPath));

	// require routers
  conventions.routers(__dirname, function(router,name) {
    var defaultBase = path.dirname(name).substring(1);
    app.use(router.baseRoute || defaultBase,router);
  });

  // app.use('/',ss.http.middleware);
  app.use(ss.http.session.middleware);
  app.use(ss.http.cached.middleware);

  console.info('Routers:'.grey, conventions.routers().join(' ').replace(/\.\//g,'').replace(/\.router\.js/g,'') || 'None.');
//});

// Start SocketStream
ss.start();