const gulp   = require('gulp')
const babel  = require('gulp-babel')
const watch  = require('gulp-watch')
const serve  = require('gulp-serve')
const copy   = require('gulp-copy')
const concat = require('gulp-concat')

const glob = {
  js: ['src/js/components/*.js', 'src/js/app.js', 'src/**/*.js'],
  html: 'src/**/*.html'
}

const output = {
  js: 'dist',
  html: 'dist'
}

gulp.task('babel', () => {
  return gulp.src(glob.js)
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(concat('app.js'))
    .pipe(gulp.dest(output.js))
})

gulp.task('html', () => {
  return gulp.src(glob.html, {base: './src'})
    .pipe(gulp.dest(output.html))
})

gulp.task('serve', serve('dist'))

gulp.task('watch', () => {
  gulp.watch([ glob.js ], ['babel'])
  gulp.watch([ glob.html ], ['html'])
})

gulp.task('default', ['serve', 'watch'])