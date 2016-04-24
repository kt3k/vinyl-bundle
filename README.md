# browserify-vinyl v0.3.0 (WIP)

> Gulp friendly module for browserify

# Install

    npm install --save-dev browserify-vinyl

# Usage

```js
const browserify = require('browserify-vinyl')
```

`browserify.src(paths[, options])` works as the stream start point which outputs the bundled scripts.

Example
```js
gulp.task('js', () => {

  return browserify.src('src/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dest'))

})
```

The second argument of `browserify.src(paths[, options])` is passed to (original) `browserify` and `glob-stream.src`. See the documents ([browserify](https://github.com/substack/node-browserify#browserifyfiles--opts), [glob-stream](https://github.com/gulpjs/glob-stream#options)) for the available options.

Example
```js
gulp.task('js', () => {

  return browserify.src('src/pages/*.js', {detectGlobals: false, base: 'src/'})
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

  return browserify.src('src/**/*', {transform: 'babelify'})
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
const browserify = require('browserify-vinyl')
const uglify = require('gulp-uglify')
const sourcemaps = require('gulp-sourcemaps')

gulp.task('js', () => {

  return browserify.src('src/**/*.js', {debug: true})
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

    .pipe(browserify.src(null, {transform: 'browserify-istanbul', passthrough: true}))
    .pipe(gulp.dest('dest'))

})
```

# API reference

```js
const browserify = require('browserify-vinyl')
```

## browserify.src(paths[, options])

- @param {string|string[]} paths The glob patterns of the paths to build
- @param {object} [options] The options (this is passed to both `browserify` and `glob-stream`)
- @param {boolean} [options.passthrough] if set true, then this stream works as transform stream. You can use this in the middle of a pipeline.
- @param {boolean} [options.globStreamDebug] if set true, then the `glob-stream.create` works in debug mode and you can see the messages.
- The options is directly passed to `browserify` and `glob-stream.create`. please see their documents for the rest of the available options. ([browserify](https://github.com/substack/node-browserify#browserifyfiles--opts), [glob-stream](https://github.com/gulpjs/glob-stream#options))

Creates a vinyl stream from the given glob patterns and options.
Each path in the glob patterns is considered as the entry point of the bundle.
The outputs of the stream are bundled scripts.

## browserify.src([paths, ]{passthrough: true[, ...options]})

- @param {string|string[]} paths The glob patterns of the paths to build, optional
- @param {object} options The options (this is passed to both `browserify` and `glob-stream`)

If you set passthrough option `true`, then this returns a duplex stream which bundles the files in the incoming stream and adds entries from the given paths if exists.
If you set passthrough option `true` and paths null, then this returns a transform stream which bundles the files in the incoming stream.
Each script in the stream is considered as the entry point of the bundle.
The outputs of the stream are bundled scripts.

# Note

- This module supports node.js >= 0.10.

# License

MIT
