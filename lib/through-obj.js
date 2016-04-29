var Transform = require('stream').Transform

module.exports = through

/**
 * Returns a transform stream with the given _transform implementation in the object mode.
 * @return {Transform}
 */
function through(transform) {
  var th = new Transform({objectMode: true})

  th._transform = transform || function (chunk, enc, cb) { cb(null, chunk) }

  return th
}
