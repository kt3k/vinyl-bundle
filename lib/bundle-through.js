var through = require('./through-obj')

var sourcemaps = require('gulp-sourcemaps')
var assign = require('object-assign')
var browserify = require('browserify')
var duplexify = require('duplexify')

module.exports = bundleThrough

/**
 * Returns a transform stream which bundles files in the given stream.
 * @param {object} options The browserify options
 * @return {Transform<Vinyl, Vinyl>}
 */
function bundleThrough(options) {

  var browserifyShouldCreateSourcemaps = options.debug || options.sourcemaps

  var bundleTransform = through(function (file, enc, callback) {

    var bundler = browserify(file.path, assign({}, options, {debug: browserifyShouldCreateSourcemaps}))

    if (options.buffer === false) {

      // if `buffer` option is `false` then `file.contents` is a stream
      return callback(null, createNewFileByContents(file, bundler.bundle().on('error', callback)))

    }

    bundler.bundle(function (err, data) {

      if (err) { return callback(err) }

      callback(null, createNewFileByContents(file, data))

    })

  })

  if (options.sourcemaps !== true) {
    return bundleTransform
  }

  return duplexify.obj(bundleTransform, bundleTransform.pipe(sourcemaps.init({loadMaps: true})))

}

/**
 * Returns a new file from the given file and contents.
 * @param {Vinyl} file The input file
 * @param {Buffer|Stream} newContents The new contents for the file
 */
function createNewFileByContents(file, newContents) {

  var newFile = file.clone()

  newFile.contents = newContents

  return newFile
}
