var through = require('./lib/through-obj')
var bundleThrough = require('./lib/bundle-through')
var createSourceStream = require('./lib/create-source-stream')

var duplexify = require('duplexify')
var merge = require('merge-stream')

module.exports.src = src

/**
 * Returns a vinyl stream of the given files which is bundled by browserify.
 * @param {string|string[]} paths The entrypoint paths of bundles
 * @param {object} [options] The options
 * @param {boolean} [options.buffer] True iff you want to make file.contents `Buffer` type. Default `true`. `false` makes `file.contents` Stream type.
 * @param {boolean} [options.debugGlobStream] True iff you want to debug the glob-stream. default false.
 * @return {Readable<Vinyl>} when passthrough: false
 * @return {Duplex<Vinyl, Vinyl>} when paths != null and passthrough: true
 * @return {Transform<Vinyl, Vinyl>} when paths == null and passthrough: true
 */
function src(paths, options) {

  if (typeof paths === 'object' && options == null) {

    // The signature is considered as `src(options)`
    options = paths
    paths = null

  }

  options = options || {}

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
