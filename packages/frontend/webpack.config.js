/* eslint-disable @typescript-eslint/no-var-requires */
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ImageminPlugin = require('imagemin-webpack-plugin').default
const InjectPlugin = require('webpack-inject-plugin').default
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const VueLoader = require('vue-loader')
const path = require('path')
const sharpResponsiveLoader = require('responsive-loader/sharp')
const webpack = require('webpack')

const isDev = (process.env.npm_lifecycle_script || '').indexOf('development') !== -1

// Temporary: force @vue/compiler-sfc to default to `pad: true` otherwise
// generated source maps will have the wrong line numbering resulting in broken
// debugger support, see issues:
// - https://github.com/vuejs/vue-next/issues/3289
// - https://github.com/vuejs/vue-loader/issues/1778
{
  const CompilerSfc = require('@vue/compiler-sfc')
  const parse = CompilerSfc.parse
  CompilerSfc.parse = (source, options) => {
    return parse(source, Object.assign({ pad: true }, options))
  }
}

module.exports = {
  entry: path.join(__dirname, 'index.ts'),
  mode: isDev ? 'development' : 'production',
  optimization: {
    minimizer: [
      new TerserPlugin({ parallel: true }),
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendors: {
          name: 'vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
        },
        bootstrap: {
          name: 'bootstrap',
          test: /[\\/]node_modules[\\/](jquery|popper\.js|bootstrap)/,
          priority: 20,
        },
        vue: {
          name: 'vue',
          test: /[\\/]node_modules[\\/]vue/,
          priority: 50,
        },
      },
    },
  },
  output: {
    path: path.join(path.resolve(`${__dirname}/../..`), 'build/dist/public'),
    publicPath: '/',
    filename: 'bundles/[name]' + ( ! isDev ? '.[chunkhash:7]' : '') + '.js',
    chunkFilename: 'bundles/[name]' + ( ! isDev ? '.[chunkhash:7]' : '') + '.js',
    devtoolModuleFilenameTemplate: info => {
      if (info.allLoaders === '') {
        // when allLoaders is an empty string the file is the original source
        // file and will be prefixed with src:// to provide separation from
        // modules transpiled via webpack
        const filenameParts = ['src://']
        if (info.namespace) {
          filenameParts.push(info.namespace + '/')
        }
        filenameParts.push(info.resourcePath.replace(/^\.\//, ''))
        return filenameParts.join('')
      } else {
        // otherwise we have a webpack module
        const filenameParts = ['webpack://']
        if (info.namespace) {
          filenameParts.push(info.namespace + '/')
        }
        filenameParts.push(info.resourcePath.replace(/^\.\//, ''))
        const isVueScript = info.resourcePath.match(/\.vue$/) &&
            info.query.match(/\btype=script\b/) &&
            ! info.allLoaders.match(/\bts-loader\b/)
        if (! isVueScript) {
          filenameParts.push('?' + info.hash)
        }
        return filenameParts.join('')
      }
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsxSuffixTo: [/\.vue$/],
        },
      },
      // vue-loader must be specified before html-loader
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        exclude: /index\.html$/,
      },
      {
        test: /\.s?css$/,
        exclude: /(?!(styles|node_modules)\/).*/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
            },
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ['autoprefixer'],
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.s?css$/,
        include: /(?!(styles|node_modules)\/).*/,
        oneOf: [
          {
            resourceQuery: /module/,
            use: [
              'vue-style-loader',
              {
                loader: 'css-loader',
                options: {
                  modules: {
                    localIdentName: '[local]-[hash:base62:5]',
                  },
                },
              },
              {
                loader: 'postcss-loader',
                options: {
                  postcssOptions: {
                    plugins: ['autoprefixer'],
                  },
                },
              },
              'sass-loader',
            ],
          },
          {
            use: [
              'vue-style-loader',
              {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  publicPath: '../',
                },
              },
              {
                loader: 'css-loader',
                options: {
                  modules: {
                    localIdentName: '[local]-[hash:base62:5]',
                    mode: 'global',
                  },
                },
              },
              {
                loader: 'postcss-loader',
                options: {
                  postcssOptions: {
                    plugins: ['autoprefixer'],
                  },
                },
              },
              'sass-loader',
            ],
          },
        ],
      },
      {
        test: /\.(webp|jpe?g|png)(\?.*)?$/,
        loader: 'responsive-loader',
        options: {
          adapter: (imagePath) => {
            const adapter = sharpResponsiveLoader(imagePath)

            return {
              metadata: () => {
                return adapter.metadata()
              },
              resize: (_ref) => {
                if (_ref.width <= 320) _ref.options.quality = 85
                else if (_ref.width <= 640) _ref.options.quality = 80
                else _ref.options.quality = 75

                return adapter.resize(_ref)
              },
            }
          },
          disable: isDev,
          name: '[path][name]' + ( ! isDev ? '-[width]px.[hash:7]' : '') + '.[ext]',
          sizes: [2160, 1080, 640, 320],
        },
      },
      {
        test: /\.svg(\?.*)?$/,
        loader: 'svg-url-loader',
        options: {
          esModule: false,
          iesafe: true,
          limit: 20000,
          name: '[path][name]' + ( ! isDev ? '.[hash:7]' : '') + '.[ext]',
          noquotes: true,
          stripdeclarations: true,
        },
      },
      {
        test: /\.(gif|ico|eot|ttf|woff)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          name: '[path][name]' + ( ! isDev ? '.[hash:7]' : '') + '.[ext]',
          esModule: false,
        },
      },
    ],
  },
  devServer: {
    host: '0.0.0.0',
    hot: true,
    historyApiFallback: {
      index: '/index.html',
    },
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.vue'],
    modules: [
      __dirname,
      path.join(__dirname, 'node_modules'),
      path.join(__dirname, '../../node_modules'),
    ],
    alias: {
      vue$: 'vue/dist/vue.esm-bundler.js',
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
    }),
    new HtmlWebpackPlugin({
      template: 'index.html',
      filename: 'index.html',
      minify: ! isDev,
    }),
    new FaviconsWebpackPlugin({
      logo: path.join(__dirname, '/assets/icons/favicon.png'),
      prefix: 'assets/icons/',
      favicons: {
        appName: 'TypeScript / Node / Vue - Monorepo Boilerplate',
        developerName: 'Andrew Mackrodt',
        developerURL: 'https://github.com/andrewmackrodt',
        icons: {
          appleStartup: false,
          coast: false,
          firefox: false,
          windows: false,
          yandex: false,
        },
      },
    }),
    new InjectPlugin(() => {
      const config = {}
      if (isDev) {
        // set the web socket port in dev environment
        // production will detect port from the url
        config.port = process.env.PORT || 5000
      }
      return 'window.globals.config = ' + JSON.stringify(config) + ';'
    }),
    new MiniCssExtractPlugin({
      filename: 'bundles/[name]' + ( ! isDev ? '.[chunkhash:7]' : '') + '.css',
      chunkFilename: 'bundles/[name]' + ( ! isDev ? '.[chunkhash:7]' : '') + '.css',
    }),
    new VueLoader.VueLoaderPlugin(),
  ],
}

if (isDev) {
  module.exports.devtool = 'source-map'
} else {
  module.exports.plugins.push(
      new ImageminPlugin({
        test: /\.(png|gif|svg)$/i,
        pngquant: {
          quality: '65-90',
          speed: 4,
        },
      }),
  )
}
