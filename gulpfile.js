var browserSync  = require('browser-sync'),
    reload       = browserSync.reload,
    gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    uglify       = require('gulp-uglify'),
    include      = require('gulp-include'),
    sourcemaps   = require('gulp-sourcemaps'),
    notify       = require("gulp-notify"), 
    jade         = require('gulp-jade'), 
    del          = require('del'),
    htmlmin      = require('gulp-htmlmin'),
    doIf         = require('gulp-if'),
    imagemin     = require('gulp-imagemin'),
    plumber      = require('gulp-plumber'),
    wiredep      = require('wiredep'),

    postcss      = require('gulp-postcss'),
    cssnano      = require('cssnano'), 
    initial      = require('postcss-initial'),
    autoreset    = require('postcss-autoreset'), 
    reporter     = require('postcss-reporter'),
    hexrgba      = require('postcss-hexrgba'),
    scss         = require('postcss-scss'),
    autoprefixer = require('autoprefixer')

gulp.task('tmpl', function() { 
    gulp.src('src/jade/*.jade')
        .pipe(jade())
        .pipe(gulp.dest('dist/'))
        .pipe(notify("jade compiled")) 
        .pipe(reload({stream:true}));
});


gulp.task('scss', function() {
    gulp.src('src/scss/*.scss')
        .pipe( sourcemaps.init())
        .pipe( postcss([ 
            // stylelint(),
            hexrgba(),
            reporter({clearMessages: true, throwError: true })], 
            { parser: scss })
        )
        .pipe(sass({errLogToConsole: true}))
        .pipe( postcss([ 
            autoprefixer({ browsers: ['last 2 versions'] }),
            reporter({clearMessages: true, throwError: true })
        ]) )
        .pipe( sourcemaps.write('.'))
        .pipe( gulp.dest('dist/css/'))
        .pipe( notify("scss compiled"))
        .pipe( reload({stream:true}));
});


gulp.task('js', function() {
    gulp.src('src/js/main.js')
        .pipe(include())
        .on('error', console.log)
        .pipe(gulp.dest('dist/js/'))
        .pipe(notify("js compiled"))
        .pipe(reload({stream:true}));
});


gulp.task('copy', function() {
    gulp.src('src/img/**/*')
        .pipe(gulp.dest('dist/img/'))
        .pipe(reload({stream:true}));

    gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('dist/fonts/'))
        .pipe(reload({stream:true}));
        
    gulp.src('src/root/**/*')
        .pipe(gulp.dest('dist/'))
        .pipe(reload({stream:true}));
});

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'dist/'
        }
        // proxy: '',
        // reloadDelay: 2000
    });
});

gulp.task('minify', function() {
    gulp.src('dist/**/*')
        .pipe(doIf('*.js', uglify()))
        .pipe(doIf('*.css', postcss([
            cssnano({autoprefixer: false})
        ])))
        .pipe(doIf('*.html', htmlmin({collapseWhitespace: true})))
        .pipe(gulp.dest('dist/'));

    gulp.src('dist/img/**/*')
        .pipe(imagemin({ 
            progressive: true, 
            interlaced: true, 
            svgoPlugins: [{cleanupIDs: false}]
        }))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('clean', function () {
    del('dist/');
});


// use task

gulp.task('watch', function() { 
    gulp.watch('src/jade/**/*.jade', ['tmpl']); 
    gulp.watch('src/jade/**/*.html', ['tmpl']); 
    gulp.watch('src/scss/**/*.scss', ['scss']);
    gulp.watch('src/js/**/*', ['js']);
});

gulp.task('server', ['watch', 'browser-sync']);

gulp.task('default',['tmpl','scss','js','copy']);
