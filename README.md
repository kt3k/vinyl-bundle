# browserify-vinyl v0.2.0 (WIP)

> Gulp friendly module for browserify

# Install

    npm install --save-dev browserify-vinyl

# Usage

```js
const browserify = require('browserify-vinyl')
```

`browserify.src(paths[, browserifyOpts[, vinylOpts]])` works as the stream start point which outputs the bundled scripts.

Example
```js
gulp.task('js', () => {

  return browserify.src('src/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dest'))

})
```

The second argument of `browserify.src(paths[, browserifyOpts[, vinylOpts]])` is passed to (original) `browserify`. See [the document](https://github.com/substack/node-browserify#browserifyfiles--opts) for the available options.

Example
```js
gulp.task('js', () => {

  return browserify.src('src/**/*.js', {detectGlobals: false})
    .pipe(gulp.dest('dest'))

})
```

The third argument of `browserify.src(paths[, browserifyOpts[, vinylOpts]])` is passed to `vinyl-fs.src`. See [the document](https://github.com/gulpjs/vinyl-fs#options) for the available options.

Example
```js
gulp.task('js', () => {

  return browserify.src('src/pages/*.js', {detectGlobals: false}, {base: 'src/'})
    .pipe(gulp.dest('dest'))

})
```

# Recipes

## Use with Babel

Use `bebelify` and set up `.babelrc`.

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

Use `debug: true` _browserify_ option and `gulp-sourcemaps` plugin.

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

Use `passthrough: true` _vinyl-fs_ option.

```js
gulp.task('js', () => {

  return gulp.src('src/**/*.js')

    .pipe(...someTransform()...)

    .pipe(browserify.src({transform: 'browserify-istanbul'}, {passthrough: true}))
    .pipe(gulp.dest('dest'))

})
```

# API reference

```js
const browserify = require('browserify-vinyl')
```

## browserify.src(paths[, browserifyOpts[, vinylOpts]])

- @param {string|string[]} paths The glob patterns of the paths to build
- @param {object} browserifyOpts The _browserify_ options
- @param {object} vinylOpts The _vinyl-fs_ options

Creates a vinyl stream from the given glob patterns and browserify options.
Each path in the glob patterns is considered as the entry point of the bundle.
The outputs of the stream are bundled scripts.

## browserify.src([paths, ]browserifyOpts, {passthrough: true[, ...vinylOpts]})

- @param {string|string[]} paths The glob patterns of the paths to build, optional
- @param {object} browserifyOpts The _browserify_ options
- @param {object} vinylOpts The _vinyl-fs_ options

This returns a transform stream which transform the script in it and adds entries from the given paths if exists.
Each script in the stream is considered as the entry point of the bundle.
The outputs of the stream are bundled scripts.

# Note

- This module supports node.js >= 0.10.

# License

MIT
