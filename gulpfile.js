const gulp = require('gulp');
const del = require('del');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const handlebars = require('handlebars');
const gulpHandlebars = require('gulp-handlebars-html')(handlebars);
const minifyCss = require('gulp-minify-css');
const rename = require("gulp-rename");
const replace = require('gulp-replace')
const browserSync = require('browser-sync').create();

const style = () => {
  return gulp.src(['./app/styles/**/*.scss'])
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(concat('style.css'))
    .pipe(minifyCss())
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

const clear = () => del(['dist/*']);

const watch = () => {
  browserSync.init({
    server: "./dist"
  });

  gulp.watch('./app/*.hbs', templates).on('all', browserSync.reload);
  gulp.watch('./app/styles/*.scss', style);
}

gulp.task('clear', clear);
gulp.task('build', gulp.series(clear, style, templates));
gulp.task('watch', gulp.series(['build'] ,watch));
