var test = require('tape')
var browserify = require('../')
var path = require('path')
var through2 = require('through2')
var uglify = require('gulp-uglify')
var sourcemaps = require('gulp-sourcemaps')

var fixtureRoot = path.join(__dirname, 'fixture')

test('browserify.src() creates vinyl stream of bundled scripts', function (t) {

  browserify.src(fixtureRoot + '/foo.js').pipe(through2.obj(function (file, _, callback) {
    t.ok(file.isBuffer(), 'The file is buffer')

    var bundledScript = file.contents.toString()

    t.ok(/This is foo\.js/.test(bundledScript), 'The file contains foo.js')
    t.ok(/This is bar\/baz\.js/.test(bundledScript), 'The file contains bar/baz.js')

    t.end()
  }))

})

test('browserify.src() emits error when unable to bundle script', function (t) {
  browserify.src(fixtureRoot + '/error.js').on('error', function (err) {
    t.ok(err instanceof Error, 'It emits error instance')
    t.end()
  })
})

test('works with uglify', function (t) {

  browserify.src(fixtureRoot + '/foo.js').pipe(uglify()).pipe(through2.obj(function (file, enc, callback) {
    t.ok(file.isBuffer(), 'The file is buffer type')

    var contents = file.contents.toString()

    t.ok(/This is foo\.js/.test(contents), 'The file contains foo.js')
    t.ok(/This is bar\/baz\.js/.test(contents), 'The file contains bar/baz/js')

    t.end()
  }))

})

test('works with sourcemaps', function (t) {

  browserify
    .src(fixtureRoot + '/foo.js', {debug: true})
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(through2.obj(function (file, enc, callback) {

      t.ok(file.isBuffer(), 'The file is buffer type')

      var contents = file.contents.toString()

      t.ok(/This is foo\.js/.test(contents), 'The file contains foo.js')
      t.ok(/This is bar\/baz\.js/.test(contents), 'The file contains bar/baz/js')
      t.ok(/sourceMappingURL=/.test(contents), 'The file contains source maps')

      t.end()

    }))

})
