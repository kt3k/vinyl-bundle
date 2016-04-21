const Transform = require('stream').Transform
const browserify = require('browserify')
const vinylFs = require('vinyl-fs')
const vinylBuffer = require('vinyl-buffer')

/**
 * Returns a transform stream which bundles files in the given stream.
 * @param {object} options The browserify options
 * @return {Transform}
 */
function through(options) {

  return new Transform({transform: function (file, enc, callback) {

    const bundleStream = browserify(file.path, options).bundle()

    bundleStream.on('error', err => { this.emit('error', err) })

    file.contents = bundleStream

    callback(null, file)

  }}).pipe(vinylBuffer())

}

/**
 * Returns a vinyl stream of the given files which is bundled by browserify.
 * @param {paths} paths The entrypoint paths of bundles
 * @param {object} options The browserify options
 * @return {Stream<Vinyl>}
 */
function src(paths, options) {
  return vinylFs.src(paths, {read: false}).pipe(through(options))
}

module.exports.src = src
module.exports.through = through
