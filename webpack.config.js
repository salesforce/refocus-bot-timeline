/**
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

const path = require('path');
// creates index.html folder and puts it in dist folder
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const env = require('./config.tsx').env;
const url = require('./config.tsx')[env].refocusUrl;
const botName = require('./package.json').name;
const Uglify = require('uglifyjs-webpack-plugin');

const config = {
  entry: './web/index.js',

  output: {
    path: path.resolve(__dirname, './web/dist'),
    filename: 'index_bundle.js',
    publicPath: '/',
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: [
          path.resolve(__dirname, 'lib'),
          path.resolve(__dirname, 'web'),
        ],
        use: 'babel-loader?compact=true',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.handlebars$/,
        loader: 'handlebars-loader',
        include: path.resolve(__dirname, 'web'),
      },
      {
        test: /.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
        use: 'url-loader?limit=100000',
        include: path.resolve(__dirname, 'web'),
      },
    ],
  },

  node: {
    fs: 'empty',
  },

  devServer: {
    historyApiFallback: true,
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'web/index.html',
      url: url + '/v1/',
      name: botName,
    }),
    new ZipPlugin({
      filename: 'bot.zip',
      include: [/\.js$/, /\.html$/],
      exclude: ['public'],
    }),
    new Dotenv({
      path: './.env',
      safe: false,
      systemvars: true,
    }),
  ],
};

if (env === 'production') {
  config.plugins.push(new Uglify());
}

module.exports = config;
