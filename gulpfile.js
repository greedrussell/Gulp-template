const gulp = require('gulp');
const del = require('del');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const handlebars = require('handlebars');
const gulpHandlebars = require('gulp-handlebars-html')(handlebars);
const minifyCss = require('gulp-minify-css');
const rename = require("gulp-rename");
const replace = require('gulp-replace');
const tinypng = require('gulp-tinypng');
const browserSync = require('browser-sync').create();
const browserify = require("browserify");
const source = require('vinyl-source-stream');
const tsify = require("tsify");
const uglify = require('gulp-uglify');
const buffer = require('vinyl-buffer');

const style = () => {
  return gulp.src('./app/styles/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('style.css'))
    .pipe(minifyCss())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/style'))
    .pipe(browserSync.stream());
}

const templates = () => {
  const options = {
    partialsDirectory: [
      `./app/partials`
    ]
  };

  return gulp.src('./app/*.hbs')
    .pipe(gulpHandlebars({}, options))
    .pipe(replace(/\uFEFF/ig, ""))
    .pipe(rename(function (path) {
      path.extname = ".html";
    }))
    .pipe(gulp.src('./app/*.html'))
    .pipe(gulp.dest(`./dist`));
}

const img = () => {
  return gulp.src(['./app/img/*.png', './app/img/*.jpg', './app/img/*.jpeg'])
    // .pipe(tinypng('vjHI7U1qQ6WhgGjqRJcY40ZmQYSzjm36'))
    .pipe(gulp.dest('dist/img'));
}

const scripts = () => {
  return browserify({
    basedir: '.',
    debug: true,
    entries: ['app/js/index.ts'],
    cache: {},
    packageCache: {}
  })
    .plugin(tsify)
    .transform('babelify', {
      presets: ['es2015'],
      extensions: ['.ts']
    })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest("dist/js"))
    .pipe(browserSync.stream());
}

const clear = () => del(['dist/*', './.gulp']);

const watch = () => {
  browserSync.init({
    server: "./dist"
  });

  gulp.watch(['./app/*.hbs', './app/partials/*.hbs'], templates).on('all', browserSync.reload);
  gulp.watch(['./app/styles/*.scss', './app/styles/**/*.scss'], style);
  gulp.watch('./app/js/*.ts', scripts);
}

gulp.task('clear', clear);
gulp.task('build', gulp.series(clear, style, templates, scripts, img));
gulp.task('watch', gulp.series(['build'] ,watch));
