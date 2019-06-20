const gulp = require('gulp');
const del = require('del');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const handlebars = require('handlebars');
const gulpHandlebars = require('gulp-handlebars-html')(handlebars);

const browserSync = require('browser-sync').create();

const style = () => {
  return gulp.src(['./app/styles/**/*.scss'])
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./dist/style'));
}

const templates = () => {
  const options = {
    partialsDirectory: [
      `./app/partials`
    ]
  };

  return gulp.src(`./app/*.html`)
    .pipe(gulpHandlebars({}, options))
    .pipe(gulp.dest(`./dist`));
}

const clear = () => del(['dist/*']);

// const watch = () => {
//   browserSync.init({
//     server: {
//       baseDir: "./src"
//     }
//   });

//   gulp.watch('./src/**/*.html', templates);
//   gulp.watch('./src/**/*.templates').on('change', browserSync.reload);
// }

// gulp.task('watch', watch);
gulp.task('clear', clear);
gulp.task('build', gulp.series(clear, gulp.series(style, templates)));