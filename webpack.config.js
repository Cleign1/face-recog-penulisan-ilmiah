const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ['html-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
    ],
  },
  resolve: {
    alias: {
      '@tensorflow/tfjs-node': path.resolve(__dirname, 'node_modules/@tensorflow/tfjs-node'),
      '@vladmandic/face-api': path.resolve(__dirname, 'node_modules/@vladmandic/face-api'),
    },
  },
  node: {
    fs: 'empty',
    child_process: 'empty',
    net: 'empty',
    tls: 'empty',
  },
};
