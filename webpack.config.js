const path = require('path');
const webpack = require('webpack');
const pkg = require('./package.json');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';

  return {
    entry: {
      swy: './src/swy.js',
    },
    output: {
      filename: isDevelopment ? '[name].js' : '[name].min.js',
      path: path.resolve(__dirname, 'dist'),
      library: {
        name: 'SWY',
        type: 'umd',
        export: 'default',
      },
      globalObject: 'this',
      sourceMapFilename: '[file].map',
    },
    mode: isDevelopment ? 'development' : 'production',
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        __SWY_VERSION__: JSON.stringify(pkg.version),
      }),
      new MiniCssExtractPlugin({
        filename: isDevelopment ? '[name].css' : '[name].min.css',
      }),
    ],
    optimization: {
      minimize: !isDevelopment,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            // Keep console output: logger.error/warn are the only production
            // diagnostics when a chart fails to render
            compress: {
              passes: 2,
            },
            format: {
              comments: false,
            },
          },
          extractComments: false,
        }),
      ],
    },
    devServer: {
      static: [
        {
          directory: path.join(__dirname, 'examples'),
        },
        {
          directory: path.join(__dirname, 'dist'),
          publicPath: '/dist/',
        },
      ],
      compress: true,
      port: 8080,
      open: true,
      hot: true,
    },
  };
};
