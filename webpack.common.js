const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = (env, argv) => {
  return ({
    context: `${__dirname}/`,
    entry: {
      bundle: './src/index.js',
    },
    output: {
      path: `${__dirname}/dist/`,
      filename: '[name].js?[fullhash]',
    },
    module: {
      rules: [
        {
          test: /\.(ts|js|jsx|tsx)$/,
          exclude: /node_modules\//,
          loader: 'ts-loader',
        },
        {
          test: /\.styl/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader, 
              options: {
                publicPath: '',
              },
            },
            'css-loader', 
            'stylus-loader',
          ],
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader, 
              options: {
                publicPath: '',
              },
            },
            'css-loader',
          ],
        },
        {
          test: /\.(webp|gif|png|jpe?g)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[path][name]-[hash].[ext]',
              },
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
                  quality: [0.75, 0.90],
                  speed: 3,
                },
                webp: {
                  quality: 75
                }
              },
            },
          ],
        },
        {
          test: /\.(eot|svg|ttf|woff|woff2)$/,
          loader: 'file-loader',
          options: {
            name: 'public/fonts/[name]-[hash].[ext]',
          },
        },
        { test: /\.mp3$/, loader: 'file-loader', options: { name: '[path][name].[ext]' } },
        { test: /\.html$/, use: 'html-loader' },
        { test: /\.csv$/, use: 'csv-loader' },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: `./src/template/index.ejs`,
      }),
      new MiniCssExtractPlugin(),
      new CopyPlugin({
        patterns: [{ from: 'src/locales', to: 'locales' }],
      }),
    ],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
  })
}
