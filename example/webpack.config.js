const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const apiMocker = require('../index');

module.exports = {
  mode: 'development',
  entry: {
    app: './src/index.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'inline-source-map',
  devServer: {
    before(app){
      apiMocker(app, { path: path.resolve('./mocker/'), proxy: {
        'GET /api/user/list': 'http://localhost:3000',
        // 'GET /api/user/*': 'http://localhost:3000',
      }})
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve('./public/index.html'),
      title: 'development'
    })
  ],
};
