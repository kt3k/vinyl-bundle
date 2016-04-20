const Transform = require('stream').Transform
const browserify = require('browserify')
const vinylFs = require('vinyl-fs')

/**
 * Returns a transform stream which bundles files in the given stream.
 * @param {object} options The browserify options
 * @return {Transform}
 */
function through(options) {
  return new Transform({transform: (file, enc, callback) => {
    file.contents = browserify(file.path, options).bundle()
    callback(null, file)
  }})
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
