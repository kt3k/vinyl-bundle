var assign = require('object-assign')
var bl = require('bl')
var browserify = require('browserify')
var duplexify = require('duplexify')
var gs = require('glob-stream')
var isValidGlob = require('is-valid-glob')
var merge = require('merge-stream')
var through2 = require('through2')
var Vinyl = require('vinyl')

/**
 * Returns a transform stream which bundles files in the given stream.
 * @param {object} options The browserify options
 * @return {Transform<Vinyl, Vinyl>}
 */
function bundleThrough(options) {

  return through2.obj(function (file, enc, callback) {

    var bundleStream = browserify(file.path, options).bundle()

    bundleStream = bundleStream.pipe(bl(function (err, data) {

      if (err) { return callback(err) }

      file = file.clone()

      file.contents = data

      callback(null, file)

    }))

  })

}

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

  return gs.create(paths, assign({}, options, {debug: options.globStreamDebug}))

    .pipe(through2.obj(function (globFile, enc, callback) {
      callback(null, new Vinyl(globFile))
    }))

}

/**
 * Returns a vinyl stream of the given files which is bundled by browserify.
 * @param {string|string[]} paths The entrypoint paths of bundles
 * @param {object} [options] The options
 * @return {Readable<Vinyl>} when passthrough: false
 * @return {Transform<Vinyl, Vinyl>} when passthrough: true
 */
function src(paths, options) {

  if (typeof paths === 'object' && options == null) {

    // The signature is considered as `src(options)`
    options = paths
    paths = null

  }

  options = options || {}

  if (options.passthrough === true) {

    var passInput = through2.obj()
    var passOutput = passInput

    // in case of passthrough=true, empty paths means no additional source in this trasnform
    if (paths != null) {

      passOutput = merge(passOutput, createSourceStream(paths, options))

    }

    return duplexify.obj(passInput, passOutput.pipe(bundleThrough(options)))

  } else {

    return createSourceStream(paths, options).pipe(bundleThrough(options))

  }

}

module.exports.src = src
