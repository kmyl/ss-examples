// Generated by CoffeeScript 1.9.2
(function() {
  var c, http, port, server, t;

  t = require('socketstream');

  http = require('http');

  c = function() {
    return console.log.apply(console, arguments);
  };

  t.client.define('basic', {
    view: 'basic.jade',
    code: ['app', 'libs'],
    css: ['app']
  });

  t.client.define('another', {
    view: 'basic.jade',
    code: ['another', 'libs'],
    css: ['another']
  });

  t.http.route('/another', function(req, res) {
    return res.serveClient('another');
  });

  t.http.route('/', function(req, res) {
    return res.serveClient('basic');
  });

  t.client.formatters.add(require('ss-coffee'));

  t.client.formatters.add(require('ss-jade'));

  t.client.formatters.add(require('ss-stylus'));

  t.session.store.use('redis');

  t.publish.transport.use('redis');

  server = http.createServer(t.http.middleware);

  t.start(server);

  process.on('uncaughtException', function(e) {
    return c('Exception caught', e);
  });

  port = 3000;

  server.listen(port);

  setInterval(function() {
    return t.api.publish.all("hey", Math.random());
  }, 2200);

}).call(this);
