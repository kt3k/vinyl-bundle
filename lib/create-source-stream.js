var through = require('./through-obj')

var assign = require('object-assign')
var gs = require('glob-stream')
var isValidGlob = require('is-valid-glob')
var Vinyl = require('vinyl')
var fs = require('graceful-fs')

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

  if (options.since != null && !(options.since instanceof Date) && !(options.since instanceof Number) && !(typeof options.since === 'number')) {
    throw new Error('invalid type of `since` option: ' + options.since)
  }

  return gs.create(paths, assign({}, options, {debug: options.debugGlobStream}))

    .pipe(wrapWithVinyl(options))

}

function wrapWithVinyl(options) {

  return through(function (globFile, enc, callback) {

    fs.stat(globFile.path, function (err, stat) {
      if (err) { callback(err) }

      globFile.stat = stat

      if (options.since && stat != null && stat.mtime < options.since) {
        return callback(null)
      }

      callback(null, new Vinyl(globFile))
    })

  })
}
