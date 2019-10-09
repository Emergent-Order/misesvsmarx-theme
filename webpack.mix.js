const mix = require('laravel-mix')
const tailwindcss = require('tailwindcss')
require('laravel-mix-purgecss')
require('laravel-mix-bundle-analyzer')

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for your application, as well as bundling up your JS files.
 |
 */

const app       = 'app'
const resources = 'resources'
const assets    = `${resources}/assets`
const dist      = 'dist'
const production = mix.inProduction()

mix.setPublicPath(dist)
mix.setResourceRoot('../')

// Don't run PurgeCSS in dev, bc it mucks up browserSync's CSS injection
if (production) {
  mix.sass(`${assets}/styles/main.scss`, `${dist}/styles`)
    .options({
      processCssUrls: false,
      postCss: [
        tailwindcss(`${assets}/styles/tailwind.config.js`),
      ]
    })
    .purgeCss({
      enabled: production,
      extensions: ['php', 'blade', 'vue'],
      whitelistPatterns: [/plyr/, /icon/, /annotation/],
      whitelistPatternsChildren: [/lyrics/]
    })
} else {
  mix.sass(`${assets}/styles/main.scss`, `${dist}/styles`)
    .options({
      processCssUrls: false,
      postCss: [
        tailwindcss(`${assets}/styles/tailwind.config.js`),
      ]
    })
}

mix.js(`${assets}/scripts/main.js`, `${dist}/scripts/main.js`)

mix.browserSync({
  host: 'localhost',
  proxy: 'https://misesvsmarx.loc',
  port: 3000,
  injectChanges: true,

  files: [
    `${app}/**/*.php`,
    `${resources}/**/*.php`,
    `${assets}/styles/tailwind.config.js`,
    `${dist}/**/*.css`,
    `${dist}/**/*.js`
  ]
})


// Assets
mix.copy(`${assets}/fonts`, `${dist}/fonts`, false)
   .copy(`${assets}/images`, `${dist}/images`, false)

// Source maps when not in production.
if (!mix.inProduction()) {
  mix.sourceMaps()
  mix.bundleAnalyzer({
    generateStatsFile: true
  })
}

// Hash and version files in production.
if (mix.inProduction()) {
  mix.version()
}
