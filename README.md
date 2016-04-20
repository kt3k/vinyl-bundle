# gulp-browserify2 v0.1.0

> Gulp plugin of browserify

# Install

    npm install --save-dev gulp-browserify2

# Usage

```js
const browserify = require('gulp-browserify2')
```

`browserify.src()` works as the stream generator which outputs the files bundled with browserify.

```js
gulp.task('js', () => {

  return browserify.src('src/**/*')
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

## Want to transform the given stream

Use `browserify.through()` method.

```js
gulp.task('js', () => {

  return gulp.src('src/**/*.js')

    .pipe(...someTransform()...)

    .pipe(browserify.through({...}))
    .pipe(gulp.dest('dest'))

})
```

# Note

- This plugin only supports node.js >= v4

# License

MIT
