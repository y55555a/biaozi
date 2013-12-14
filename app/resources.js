var ensureLogin = require('connect-ensure-login')
  , ensureLoggedIn = ensureLogin.ensureLoggedIn('/signin')
  , ensureNotLoggedIn = ensureLogin.ensureNotLoggedIn()

var express = require('express')
  , join = require('path').join

module.exports = function (app) {
  var index = require('../routes/index')
  app.all('/'         , ensureLoggedIn, index.show)
  app.all('/signout'  , ensureLoggedIn, index.signout)
  app.get('/signin'   , ensureNotLoggedIn, index.signin)
    .post('/signin'   , ensureNotLoggedIn, index.authenticate)

  var calendarApi = require('../routes/api/calendar')
  app.get('/api/calendar',  ensureLoggedIn, calendarApi.show)

  var confirmedApi = require('../routes/api/confirmed')
  app.get('/api/confirmed', ensureLoggedIn, confirmedApi.show)

  // serves stylus compiled css
  var stylus = require('stylus')
    , nib = require('nib')

  var dev = 'development' == app.get('env')

  app.use('/assets/css', stylus.middleware({
    src: join(__dirname, './assets/css')
  , dest: join(__dirname, '../public/assets/css')
  , compile: function (str, path) {
      return stylus(str)
        .set('filename', path)
        .set('compress', !dev)
        .set('firebug', !dev)
        .set('linenos', !dev)
        .use(nib())
    }
  }))

  if (dev) {
    app.use('/assets/js', express.static(join(__dirname, './assets/js')))
  }

  // serves general static files
  app.use(express.static(join(__dirname, '../public')))

}
