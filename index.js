var through = require('./lib/through-obj')
var bundleThrough = require('./lib/bundle-through')
var createSourceStream = require('./lib/create-source-stream')

var assign = require('object-assign')
var duplexify = require('duplexify')
var merge = require('merge-stream')

module.exports.src = src

/**
 * Returns a vinyl stream of the given files which is bundled by browserify.
 * @param {string|string[]} paths The entrypoint paths of bundles
 * @param {object} [options] The options
 * @param {string} [options.cwd] The working directory the folder is relative to. Default is `process.cwd()`.
 * @param {string} [options.base] The folder relative to the cwd. This is used to determine the file names when saving in `gulp.dest()`.
 * @param {boolean} [options.buffer] True iff you want to make file.contents `Buffer` type. Default `true`. `false` makes `file.contents` Stream type.
 * @param {boolean} [options.sourcemaps] `true` iff you want files to have sourcemaps enabled.
 * @param {Date|number} [options.since] If you only want files that have been modified since the time specified.
 * @param {string|string[]|etc} [options.transform]
 * @param {boolean} [options.debugGlobStream] True iff you want to debug the glob-stream. default false.
 * @param {boolean} [options.passthrough] if set true, then this stream works as a duplex stream and input files are bundled. You can use this in the middle of a pipeline. In case you pass paths as null, then this works as a transform stream.
 * @return {Readable<Vinyl>} when passthrough: false
 * @return {Duplex<Vinyl, Vinyl>} when paths != null and passthrough: true
 * @return {Transform<Vinyl, Vinyl>} when paths == null and passthrough: true
 */
function src(paths, options) {

  if (pathsSeemOptions(paths) && options == null) {

    // The signature is considered as `src(options)`
    options = paths
    paths = null

  }

  options = assign({
    buffer: true,
    sourcemaps: false,
    debugGlobStream: false,
    passthrough: false
  }, options)

  if (options.passthrough === true) {

    // when paths=null and passthrough=true, returns a Transform stream
    if (paths == null) {

      return bundleThrough(options)

    }

    var passInput = through()

    var passOutput = merge(passInput, createSourceStream(paths, options))

    return duplexify.obj(passInput, passOutput.pipe(bundleThrough(options)))

  } else {

    return createSourceStream(paths, options).pipe(bundleThrough(options))

  }

}

/**
 * Returns true if paths seems like the options (object type).
 * @param {Object} paths The paths
 * @return {boolean}
 */
function pathsSeemOptions(paths) {
  return typeof paths === 'object' && !Array.isArray(paths)
}
