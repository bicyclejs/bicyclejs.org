'use strict';

var url = require('url');
var stop = require('stop');
var rimraf = require('rimraf').sync;

var server = require('./server.js');

rimraf(__dirname + '/out');

module.exports = stop.getWebsiteStream('http://localhost:3000', {
  filter: function (currentURL) {
    var u = url.parse(currentURL);
    return u.hostname === 'localhost';
  },
  parallel: 1
})
.on('data', function (page) {
  if (page.statusCode !== 200) {
    throw new Error('Unexpected status code ' + page.statusCode +
                    ' for ' + page.url);
  }
  console.log(page.statusCode + ' - ' + page.url);
})
.syphon(stop.writeFileSystem(__dirname + '/out'))
.wait().then(function () {
  server.close();
  console.log('successfuly compiled website');
});
