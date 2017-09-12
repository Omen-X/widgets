const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const notifier = require('node-notifier');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const { getIfUtils, removeEmpty } = require('webpack-config-utils');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');

const { ifProduction, ifDevelopment } = getIfUtils(process.env.NODE_ENV);

const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
  },
  devtool: ifDevelopment('source-map'),
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/,
        options: {
          presets: ['env'],
        },
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: { importLoader: 1, sourceMap: true },
            },
            { loader: 'postcss-loader', options: { sourceMap: true } },
          ],
          // publicPath: '../',
        }),
      },
      {
        test: /\.(sass|scss)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: { importLoader: 1, sourceMap: true },
            },
            { loader: 'postcss-loader', options: { sourceMap: true } },
            {
              loader: 'sass-loader',
              // options: { includePaths: ['./src'], sourceMap: true },
            },
          ],
          // publicPath: '../',
        }),
      },
      // {
      //   test: /\.(png|jpg|gif)$/,
      //   include: [path.resolve(__dirname, 'src/img/content')],
      //   use: ['file-loader?name=[name].[ext]&outputPath=img/content/'],
      // },
      // {
      //   test: /\.(png|jpg|gif)$/,
      //   include: [
      //     path.resolve(__dirname, 'src/img/decor'),
      //     path.resolve(__dirname, 'node_modules'),
      //   ],
      //   use: ['file-loader?name=[name].[ext]&outputPath=img/decor/'],
      // },
      // {
      //   test: /\.svg$/,
      //   use: [{ loader: 'file-loader?name=[name].[ext]&outputPath=img/decor' }],
      // },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      excludeChunks: ifProduction(['js/app'], []),
      template: 'src/index.html',
      // favicon: 'src/img/favicon/favicon.ico',
      minify: false,
    }),
    // extract css
    new ExtractTextPlugin({
      filename: 'css/app.css',
      allChunks: true,
    }),
    new FriendlyErrorsWebpackPlugin({
      onErrors: (severity, errors) => {
        if (severity !== 'error') return;
        const error = errors[0];
        notifier.notify({
          title: 'Building error',
          message: error.message,
          subtitle: error.file || '',
          sound: false,
        });
      },
    })
  ],
};

// PRODUCTION
if (process.env.NODE_ENV === 'production') {
  const prodPlugins = [
    // new ArchivePlugin({ format: 'zip' }),
    new UglifyJsPlugin({
      include: /(\.min\.js$|vendor)/,
      beautify: false,
      mangle: { screw_ie8: true },
      compress: { screw_ie8: true, warnings: false },
      comments: false,
    }),
    new CleanWebpackPlugin(['dist', './dist.zip'], {
      verbose: false,
      dry: false,
    }),
    new ImageminPlugin({
      svgo: { removeViewBox: false },
      plugins: [imageminMozjpeg(), imageminPngquant({ verbose: true })],
    }),
  ];

  config.plugins.push(...prodPlugins);

  // DEVELOPMENT
} else {
  config.devServer = {
    contentBase: path.resolve(__dirname, 'dist'),
    port: 3000,
    publicPath: '/',
    compress: true,
    stats: 'minimal'
    // stats: {
    //   assetsSort: 'size',
    //   assets: false,
    //   children: false,
    //   publicPath: false,
    //   chunks: false,
    //   hash: false,
    //   colors: true,
    //   version: false,
    // },
  };
}

module.exports = config;
