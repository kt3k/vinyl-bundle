# gulp-browserify2 v0.1.0 (WIP)

> Gulp plugin for browserify

# Install

    npm install --save-dev gulp-browserify2

# Usage

```js
const browserify = require('gulp-browserify2')
```

`browserify.src()` works as the stream generator which outputs the files bundled by browserify.

```js
const uglify = require('gulp-uglify')

gulp.task('js', () => {

  return browserify.src('src/**/*.js')
    .pipe(uglify())
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

Use `debug: true` option and `gulp-sourcemaps` plugin.

## Transform through the given stream

Use `browserify.through(options)` method.

```js
gulp.task('js', () => {

  return gulp.src('src/**/*.js')

    .pipe(...someTransform()...)

    .pipe(browserify.through({transform: ...}))
    .pipe(gulp.dest('dest'))

})
```

# API reference

```js
const browserify = require('gulp-browserify2')
```

## browserify.src(paths, options)

- @param {string} paths The glob patterns of the paths to build
- @param {object} options The browserify options

Creates a vinyl stream from the given glob patterns and browserify options.
Each path in the glob patterns is considered as the entry point of the bundle.
The outputs of the stream are bundled scripts.

## browserify.through(options)

- @param {object} options The browserify options

This returns a transform stream which transform the script in it.
Each script in the stream is considered as the entry point of the bundle.
The outputs of the stream are bundled scripts.

# Note

- This plugin only supports node.js >= v4.

# License

MIT
