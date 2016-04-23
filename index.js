var assign = require('object-assign')
var through2 = require('through2')
var browserify = require('browserify')
var vinylFs = require('vinyl-fs')
var bl = require('bl')

/**
 * Returns a transform stream which bundles files in the given stream.
 * @param {object} options The browserify options
 * @return {Transform}
 */
function through(options) {

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
 * Returns a vinyl stream of the given files which is bundled by browserify.
 * @param {string|string[]} paths The entrypoint paths of bundles
 * @param {object} browserifyOpts The browserify options
 * @param {object} vinylOpts The vinyl-fs options
 * @return {Stream<Vinyl>}
 */
function src(paths, browserifyOpts, vinylOpts) {

  if (typeof paths === 'object' && typeof browserifyOpts === 'object' && vinylOpts == null) {

    // The signature is considered as `src(browserifyOpts, vinylOpts)`
    vinylOpts = browserifyOpts
    browserifyOpts = paths
    paths = null

  }

  if (paths == null && vinylOpts.passthrough) {

    // The special case:
    // `passthrough` is true and glob pattern is empty,
    // doesn't need to source files and just performs browserify transform
    src = through2.obj()

  } else {

    src = vinylFs.src(paths, assign({read: false}, vinylOpts))

  }

  return src.pipe(through(browserifyOpts))

}

module.exports.src = src
