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
import rev from 'gulp-rev';
import revReplace from 'gulp-rev-replace';
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
const imagesDest = 'public/img/';
const imagesQuery = 'src/assets/img/*.{jpg,png,svg}';
const assetsQuery = ['src/assets/**/*.*', '!src/assets/img/**/*.*'];

const imageOptimPlugins = [
  imagemin.optipng({ optimizationLevel: 3 }),
  imagemin.jpegtran({ progressive: true }),
  imagemin.svgo()
];

const plumberMessage = (title) => ({
  errorHandler: notify.onError((err) => ({
    title,
    message: err.message
  }))
});

const clean = () => del(['public', 'manifest']);

const compileTemplates = () =>
  gulp
    .src('src/templates/pages/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('public'));

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
          revReplace({
            manifest: gulp.src('manifest/svg.json', { allowEmpty: true })
          }),
          revReplace({
            manifest: gulp.src('manifest/images.json', { allowEmpty: true })
          }),
          cssnano(),
          rev()
        )
      )
    )
    .pipe(gulp.dest('public/styles'))
    .pipe(
      gulpIf(
        !isDevelopment,
        combine(rev.manifest('css.json'), gulp.dest('manifest'))
      )
    );

const compileJS = () =>
  gulp
    .src('src/js/index.js')
    .pipe(plumber(plumberMessage('compileJS')))
    .pipe(webpackStream(webpackConfig, webpack))
    .pipe(gulpIf(!isDevelopment, combine(stripDebug(), rev())))
    .pipe(gulp.dest('public/js/'))
    .pipe(
      gulpIf(
        !isDevelopment,
        combine(rev.manifest('js.json'), gulp.dest('manifest'))
      )
    );

const createSVGSprite = () =>
  gulp
    .src('src/svg-sprite/**/*.svg')
    .pipe(plumber(plumberMessage('createSVGSprite')))
    .pipe(
      svgSprite({
        mode: {
          stack: {
            dest: '.',
            sprite: 'sprite.svg',
            layout: 'vertical'
          }
        }
      })
    )
    .pipe(gulp.dest('public/img/'));

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
  .pipe(gulpIf(!isDevelopment, rev()))
  .pipe(imagemin(imageOptimPlugins))
  .pipe(gulp.dest(imagesDest))
  .pipe(
    gulpIf(
      !isDevelopment,
      combine(rev.manifest('images.json'), gulp.dest('manifest'))
    )
  );

const copyAssets = () =>
  gulp
    .src(assetsQuery)
    .pipe(plumber(plumberMessage('copyAssets')))
    .pipe(changed('public'))
    .pipe(
      gulpIf(
        !isDevelopment,
        revReplace({
          manifest: gulp.src('manifest/css.json', { allowEmpty: true })
        })
      )
    )
    .pipe(
      gulpIf(
        !isDevelopment,
        revReplace({
          manifest: gulp.src('manifest/js.json', { allowEmpty: true })
        })
      )
    )
    .pipe(gulp.dest('public'));

const watch = (done) => {
  gulp.watch('src/templates/**/*.pug', compileTemplates);
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
      baseDir: './public'
    },
    open: false,
  });

  bs.watch('public/**/*.*').on('change', bs.reload);
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
