var browserify = require('browserify')
var through = require('./through-obj')

module.exports = bundleThrough

/**
 * Returns a transform stream which bundles files in the given stream.
 * @param {object} options The browserify options
 * @return {Transform<Vinyl, Vinyl>}
 */
function bundleThrough(options) {

  return through(function (file, enc, callback) {

    browserify(file.path, options).bundle(function (err, data) {

      if (err) { return callback(err) }

      file = file.clone()

      file.contents = data

      callback(null, file)

    })

  })

}
