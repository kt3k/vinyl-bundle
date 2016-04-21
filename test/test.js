const test = require('tape')
const browserify = require('../')
const path = require('path')
const through2 = require('through2')

const fixtureRoot = path.join(__dirname, 'fixture')

test('browserify.src() creates vinyl stream of bundled scripts', t => {

  browserify.src(`${ fixtureRoot }/foo.js`).pipe(through2.obj((file, _, callback) => {
    t.ok(file.isBuffer(), 'The file is buffer')

    const bundledScript = file.contents.toString()

    t.ok(/This is foo\.js/.test(bundledScript), 'The file contains foo.js')
    t.ok(/This is bar\/baz\.js/.test(bundledScript), 'The file contains bar/baz.js')

    t.end()
  }))

})

test('browserify.src() emits error when unable to bundle script', t => {
  browserify.src(`${ fixtureRoot}/error.js`).on('error', err => {
    t.ok(err instanceof Error, 'It emits error instance')
    t.end()
  })
})
