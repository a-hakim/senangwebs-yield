const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';

  return {
    entry: {
      'swy': './src/swy.js',
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
    devtool: isDevelopment ? 'source-map' : 'source-map',
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
          ],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: isDevelopment ? '[name].css' : '[name].min.css',
      }),
    ],
    optimization: {
      minimize: !isDevelopment,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: !isDevelopment,
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