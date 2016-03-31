import concat        from 'gulp-concat';
import gulp          from 'gulp';
import ngAnnotate    from 'gulp-ng-annotate';
import plumber       from 'gulp-plumber';
import uglify        from 'gulp-uglify';
import babel from 'gulp-babel';

const build = () => {
  gulp
    .src('./src/lock-screen/lock-screen.js')
    .pipe(plumber())
    .pipe(babel())
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(concat('index.js'))
    .pipe(gulp.dest('./dist'));
};

gulp.task('build', build);

gulp.task('watch', () => {
  gulp.run(['build']);
  gulp.watch('./src/lock-screen/lock-screen.js', ['build']);
});

gulp.task('default', ['build']);
