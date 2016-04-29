var through = require('./through-obj')

var fs = require('graceful-fs')
var assign = require('object-assign')
var gs = require('glob-stream')
var isValidGlob = require('is-valid-glob')
var Vinyl = require('vinyl')

module.exports = createSourceStream

/**
 * Creates the source stream from the given paths and options.
 * @param {string|string[]} paths The entrypoint paths of bundles
 * @param {object} [options] The options
 * @return {Readable<Vinyl>}
 */
function createSourceStream(paths, options) {

  if (!isValidGlob(paths)) {
    throw new Error('The given glob pattern is not valid: ' + String(paths))
  }

  return gs.create(paths, assign({}, options, {debug: options.debugGlobStream}))

    .pipe(through(function (globFile, enc, callback) {

      callback(null, new Vinyl(globFile))

    }))

}
