# vinyl-bundle v0.4.0 (WIP) [![Circle CI](https://circleci.com/gh/kt3k/vinyl-bundle.svg?style=svg)](https://circleci.com/gh/kt3k/vinyl-bundle) [![codecov](https://codecov.io/gh/kt3k/vinyl-bundle/branch/master/graph/badge.svg)](https://codecov.io/gh/kt3k/vinyl-bundle)


> A gulp friendly module which creates a bundled vinyl stream

# Install

    npm install --save-dev vinyl-bundle

# Usage

```js
const bundle = require('vinyl-bundle')
```

`bundle.src(paths[, options])` works as a stream start point which outputs the bundled scripts using `browserify`.

Example
```js
gulp.task('js', () => {

  return bundle.src('src/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dest'))

})
```

The second argument of `bundle.src(paths[, options])` is passed to (original) `browserify` and `glob-stream.src`. See the documents ([browserify](https://github.com/substack/node-browserify#browserifyfiles--opts), [glob-stream](https://github.com/gulpjs/glob-stream#options)) for the available options.

Example
```js
gulp.task('js', () => {

  return bundle.src('src/pages/*.js', {detectGlobals: false, base: 'src/'})
    .pipe(gulp.dest('dest'))

})
```

# Recipes

## Use with Babel

Use `bebelify` transfrom and create `.babelrc`.

First you need to install `babelify` module

    npm install --save-dev babelify

gulpfile.js
```js
gulp.task('js', () => {

  return bundle.src('src/**/*', {transform: 'babelify'})
    .pipe(gulp.dest('dest'))

})
```

.babelrc
```json
{
  "presets": [
    "es2015",
    "stage-2"
  ]
}
```


## Output the sourcemap

Use `debug: true` option and `gulp-sourcemaps` plugin.

```js
const bundle = require('vinyl-bundle')
const uglify = require('gulp-uglify')
const sourcemaps = require('gulp-sourcemaps')

gulp.task('js', () => {

  return bundle.src('src/**/*.js', {debug: true})
    .pipe(sourcemaps.init({loadMaps: true})
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dest'))

})
```

## Transform through the given stream

Use `passthrough: true` option.

```js
gulp.task('js', () => {

  return gulp.src('src/**/*.js')

    .pipe(...someTransform()...)

    .pipe(bundle.src(null, {transform: 'browserify-istanbul', passthrough: true}))
    .pipe(gulp.dest('dest'))

})
```

# API reference

```js
const bundle = require('vinyl-bundle')
```

## bundle.src(paths[, options])

- @param {string|string[]} paths The glob patterns of the paths to build
- @param {object} [options] The options (this is passed to both `browserify` and `glob-stream`)
- @param {string} [options.cwd] The working directory the folder is relative to. Default is `process.cwd()`.
- @param {string} [options.base] The folder relative to the cwd. This is used to determine the file names when saving in `gulp.dest()`.
- @param {boolean} [options.buffer] `true` iff you want to make file.contents `Buffer` type. Default `true`. `false` makes `file.contents` Stream type.
- @param {boolean} [options.sourcemaps] `true` iff you want files to have sourcemaps enabled.
- @param {Date|number} [options.since] If you only want files that have been modified since the time specified.
- @param {string|string[]|etc} [options.transform] The browserify transforms. See [browserify's document](https://github.com/substack/node-browserify#browserifyfiles--opts) for details.
- @param {boolean} [options.debugGlobStream] If set true, then the `glob-stream.create` works in debug mode and you can see the additional messages.
- @param {boolean} [options.passthrough] If set true, then this stream works as a duplex stream and input files are bundled. You can use this in the middle of a pipeline. In case you pass paths as null, then this works as a transform stream.
- The options is directly passed to `browserify` and `glob-stream.create`. Please see their documents for the rest of the available options. ([browserify](https://github.com/substack/node-browserify#browserifyfiles--opts), [glob-stream](https://github.com/gulpjs/glob-stream#options))
- @return {stream.Readable<Vinyl>}

Creates a vinyl stream from the given glob patterns and options.
Each path in the glob patterns is considered as the entry point of the bundle.
The outputs of the stream are bundled scripts.

# Note

- This module supports node.js >= 0.10.

# License

MIT
