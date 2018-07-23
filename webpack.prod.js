const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const extractSass = new ExtractTextPlugin('style.css')
const indexTemplate = new HtmlWebpackPlugin({ 
  template: `template/index.ejs`,
})

module.exports = {
  mode: 'production',
  context: __dirname + '/src/',
  entry: {
    app: './index.js',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      name: true,
      cacheGroups: {
        default: {
          priority: -20,
          reuseExistingChunk: true,
        },
        vendors: {
          name: 'vendor',
          priority: -10,
          reuseExistingChunk: true,
          test: /[\\/]node_modules[\\/]/,
        },
      }
    }
  },
  output: {
    path: __dirname + '/dist/',
    filename: 'js/[name].js'
  },
  devServer: {
    inline: true,
    https: true,
    public:'0.0.0.0:3000',
    port: 3000,
  },
  module: {
    rules: [
      {
        test: /\.js(x)?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
            presets: ['env']
        }
      },
      {
        test: /\.scss$/,
        use: extractSass.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            { loader: 'postcss-loader', options: { path: 'postcss.config.json' } },
            'sass-loader'
          ]
        })
      },
      {
        test: /\.(gif|png|jpe?g)$/i,
        loaders: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]'
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
              },
              gifsicle: {
                interlaced: false,
              },
              optipng: {
                optimizationLevel: 4,
              },
              pngquant: {
                quality: '75-90',
                speed: 3,
              },
            }
          }
        ]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          name: 'public/[name].[ext]'
        }
      },
      { 
        test: /\.html$/, 
        loader: 'html-loader',
        options: {
          name: '[name].[ext]'
        }
      }
    ]
  },
  plugins: [
    indexTemplate,
    extractSass,
  ],
}
