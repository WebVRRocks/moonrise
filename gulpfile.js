const gulp = require('gulp');
const babel = require('gulp-babel');
const gulpUtil = require('gulp-util');
const rimraf = require('gulp-rimraf');
const sass = require('gulp-sass');

const htmlPath = 'src/index.html';
const jsPath = [
  'src/**/*.js',
  'src/**/*.jsx'
];
const sassPath = 'style/**/*.scss';
const fontPath = 'style/fonts/*.*';

let electron = null;
let errorQueue = [];
let isWatching = false;
let hasElectronStarted = false;
let hasErrors = false;

function startDev () {
  console.log('start dev');
  electron = require('electron-connect').server.create({
    stopOnClose: true
  });

  isWatching = true;  // So we don't crash when watching.
  hasErrors = false;
}

function enqueueError () {
  return err => {
    // Function changed to enqueue errors.
    errorQueue.unshift(err);
  };
}

let broadcastError = enqueueError();

const electronCallback = electronProcessState => {
  broadcastError = enqueueError();

  if (electronProcessState === 'stopped') {
    process.exit();
  } else if (electronProcessState === 'started' || electronProcessState === 'restarted') {
    hasElectronStarted = true;

    broadcastError = err => {
      // Change function to actually send errors.
      electron.broadcast('error', err);
    };

    electron.on('ready', () => {
      while (errorQueue.length) {
        broadcastError(errorQueue.pop());
      }
    });
  }
};

const gracefulWrap = stream => {
  stream.on('error', err => {
    hasErrors = true;
    broadcastError(err);
    gulpUtil.log(gulpUtil.colors.red(err.message));
    gulpUtil.log(err.stack);
    if (isWatching) {
      gulpUtil.log(gulpUtil.colors.yellow('[aborting]'));
      stream.end();
    } else {
      gulpUtil.log(gulpUtil.colors.yellow('[exiting]'));
      process.exit(1);
    }
  });
  return stream;
};

gulp.task('default', ['build']);

gulp.task('build', ['clean'], () => {
  gulp.start('transpile-js', 'transpile-sass', 'copy-fonts');
});

gulp.task('dev', ['default'], () => {
  startDev();

  gulp.watch(htmlPath, ['dev-html']);
  gulp.watch(jsPath, ['dev-js']);
  gulp.watch(sassPath, ['dev-sass']);
  gulp.watch(fontPath, ['dev-fonts']);
});

gulp.task('dev-html', ['electron-reload']);
gulp.task('dev-js', ['transpile-js']);
gulp.task('dev-sass', ['transpile-sass', 'electron-reload']);
gulp.task('dev-font', ['copy-fonts', 'electron-reload']);

function electronStart () {
  electron.start(electronCallback);
}
function electronReload () {
  if (hasElectronStarted) {
    electron.reload(electronCallback);
  } else {
    electronStart();
  }
}
function electronRestart () {
  if (hasElectronStarted) {
    electron.restart(electronCallback);
  } else {
    electronStart();
  }
}
function electronStop () {
  electron.stop(electronCallback);
}

gulp.task('electron-reload', () => {
  if (hasErrors) {
    return;
  }
  electronReload();
});
gulp.task('electron-restart', () => {
  if (hasErrors) {
    return;
  }
  electronRestart();
});
gulp.task('electron-stop', () => {
  electronStop();
});

gulp.task('watch', ['default'], () => {
  isWatching = true;  // So we don't crash when watching.

  gulp.watch(jsPath, ['transpile-js']);
  gulp.watch(sassPath, ['transpile-sass']);
  gulp.watch(fontPath, ['copy-fonts']);
});

gulp.task('clean', () => {
  return gulp.src(['dist/css', 'dist/js'], {read: false})
    .pipe(rimraf());
});

gulp.task('transpile-js', () => {
  hasErrors = false;
  return gulp.src(jsPath)
    .pipe(gracefulWrap(babel().on('error', () => {
      hasErrors = true;
    })))
    .pipe(gracefulWrap(gulp.dest('dist/js'), true).on('end', () => {
      if (electron) {
        if (!hasErrors) {
          electronRestart();
        }
      }
    }));
});

gulp.task('transpile-sass', () => {
  gulp.src(sassPath)
    .pipe(gracefulWrap(sass().on('error', sass.logError)))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('copy-fonts', () => {
  gulp.src(fontPath)
    .pipe(gulp.dest('dist/css/fonts'));
});
