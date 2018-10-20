import gulp from 'gulp';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import cssnano from 'gulp-cssnano';
import autoprefixer from 'gulp-autoprefixer';
import imagemin from 'gulp-imagemin';
import webp from 'gulp-webp';
import svgSprite from 'gulp-svg-sprite';
import stripDebug from 'gulp-strip-debug';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import pug from 'gulp-pug';
import gulpIf from 'gulp-if';
import plumber from 'gulp-plumber';
import changed from 'gulp-changed';
import notify from 'gulp-notify';
import browserSync from 'browser-sync';
import del from 'del';
import combineS from 'stream-combiner2';
import webpackConfig from './webpack.config.js';
// import debug from 'gulp-debug';
// import nodemon from 'gulp-nodemon';

const bs = browserSync.create();
const combine = combineS.obj;
const isDevelopment = process.env.NODE_ENV !== 'production';
const buildFolder = 'public';
const imagesDest = `${buildFolder}/img`;
const imagesQuery = 'src/assets/img/*.{jpg,png,svg}';
const assetsQuery = ['src/assets/**/*.*', '!src/assets/img/**/*.*'];

const imageOptimPlugins = [
  imagemin.optipng({ optimizationLevel: 3 }),
  imagemin.jpegtran({ progressive: true }),
  imagemin.svgo()
];

const plumberMessage = (title) => ({
  errorHandler: notify.onError(({ message }) => ({
    title,
    message
  }))
});

const clean = () => del([`${buildFolder}/**`]);

const compileTemplates = () =>
  gulp
    .src('src/templates/pages/*.pug')
    .pipe(plumber(plumberMessage('compileTemplates')))
    .pipe(pug(pug({
      pretty: true,
    })))
    .pipe(gulp.dest(buildFolder));

const compileStyles = () =>
  gulp
    .src('src/styles/common.scss')
    .pipe(plumber(plumberMessage('compileStyles')))
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(
      sass({
        includePaths: ['tmp/styles', 'node_modules/normalize-scss/sass']
      })
    )
    .pipe(gulpIf(isDevelopment, sourcemaps.write()))
    .pipe(
      gulpIf(
        !isDevelopment,
        combine(
          autoprefixer({ browsers: ['last 2 versions'] }),
          cssnano(),
        )
      )
    )
    .pipe(gulp.dest(`${buildFolder}/styles/`));

const compileJS = () =>
  gulp
    .src('src/js/index.js')
    .pipe(plumber(plumberMessage('compileJS')))
    .pipe(webpackStream(webpackConfig, webpack))
    .pipe(gulpIf(!isDevelopment, stripDebug()))
    .pipe(gulp.dest(`${buildFolder}/js/`));

const createSVGSprite = () =>
  gulp
    .src('src/svg-sprite/**/*.svg')
    .pipe(plumber(plumberMessage('createSVGSprite')))
    .pipe(
      svgSprite({
        mode: {
          symbol: {
            dest: '.',
            sprite: 'sprite.svg',
            layout: 'vertical'
          }
        }
      })
    )
    .pipe(gulp.dest(imagesDest));

const createWebpImages = () =>
  gulp
    .src('src/assets/img/*.{png,jpg}')
    .pipe(plumber(plumberMessage('createWebpImages')))
    .pipe(changed(imagesDest))
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest(imagesDest));

const copyImages = () => gulp
  .src(imagesQuery)
  .pipe(plumber(plumberMessage('copyImages')))
  .pipe(changed(imagesDest))
  .pipe(imagemin(imageOptimPlugins))
  .pipe(gulp.dest(imagesDest));

const copyAssets = () =>
  gulp
    .src(assetsQuery)
    .pipe(plumber(plumberMessage('copyAssets')))
    .pipe(changed(buildFolder))
    .pipe(gulp.dest(buildFolder));

const watch = (done) => {
  gulp.watch('src/templates/pages/*.pug', compileTemplates);
  gulp.watch(['src/styles/**/*.scss', 'tmp/styles/sprite.scss'], compileStyles);
  gulp.watch('src/js/**/*.js', compileJS);
  gulp.watch('src/svg-sprite/**/*.svg', createSVGSprite);
  gulp.watch(imagesQuery, gulp.parallel(createWebpImages, copyImages));
  gulp.watch(assetsQuery, copyAssets);
  done();
};

const syncBrowser = (done) => {
  bs.init(null, {
    server: {
      baseDir: `./${buildFolder}`
    },
    open: false,
    notify: false,
  });

  bs.watch(`${buildFolder}/**/*.*`, {ignored: '*.map'}).on('change', bs.reload);
  done();
};

const buildQueue = [
  clean,
  compileTemplates,
  compileStyles,
  compileJS,
  createSVGSprite,
  createWebpImages,
  copyImages,
  copyAssets
];

gulp.task('build', gulp.series(...buildQueue));
gulp.task('dev', gulp.series('build', gulp.parallel(watch, syncBrowser)));
