var through = require('./through-obj')

var browserify = require('browserify')

module.exports = bundleThrough

/**
 * Returns a transform stream which bundles files in the given stream.
 * @param {object} options The browserify options
 * @return {Transform<Vinyl, Vinyl>}
 */
function bundleThrough(options) {

  return through(function (file, enc, callback) {

    var bundler = browserify(file.path, options)

    if (options.buffer === false) {

      // if `buffer` option is `false` then `file.contents` is a stream
      return callback(null, createNewFileByContents(file, bundler.bundle().on('error', callback)))

    }

    bundler.bundle(function (err, data) {

      if (err) { return callback(err) }

      callback(null, createNewFileByContents(file, data))

    })

  })

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
