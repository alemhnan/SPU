const gulp = require('gulp');
const rollup = require('rollup-stream');
const babel = require('rollup-plugin-babel');
const source = require('vinyl-source-stream');
const uglify = require('rollup-plugin-uglify');
const minify = require('uglify-js').minify;
const header = require('gulp-header');
const sourcemaps = require('gulp-sourcemaps');
const buffer = require('vinyl-buffer');

const pkg = require('./package.json');

const banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @author <%= pkg.author %>',
  ' * @license <%= pkg.license %> */',
  ''].join('\n');

gulp.task('build', () =>
  rollup({
    entry: './src/script.js',
    sourceMap: true,
    format: 'umd',
    moduleName: 'SPU',
    plugins: [
      babel({
        exclude: 'node_modules/**',
      }),
      uglify({}, minify),
    ],
  })
    .pipe(source('spu.min.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(header(banner, { pkg }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./build'))
);
