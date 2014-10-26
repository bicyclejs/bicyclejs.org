'use strict';

var express = require('express');
var jade = require('jade');
var highlight = require('highlight-codemirror');

var app = express();
app.engine('jade', jade.renderFile);
app.set('views', __dirname + '/views');

highlight.loadMode('htmlmixed');
highlight.loadMode('javascript');
jade.filters.html = function (src) {
  return '<pre><code>' + highlight(src, 'htmlmixed') + '</code></pre>';
};
jade.filters.js = function (src) {
  return '<pre><code>' + highlight(src, 'javascript') + '</code></pre>';
};

app.use(function (req, res, next) {
  res.locals.currentUrl = req.url;
  next();
});
app.get('/', function (req, res, next) {
  res.render('index.jade');
});
app.get('/getting-started', function (req, res, next) {
  res.render('getting-started.jade');
});
app.get('/docs', function (req, res, next) {
  res.redirect('/docs/client');
});
app.get('/docs/client', function (req, res, next) {
  res.render('docs/client/index.jade');
});
app.get('/docs/client/:id', function (req, res, next) {
  res.render('docs/client/' + req.params.id + '.jade');
});

module.exports = app.listen(process.env.PORT || 3000);
