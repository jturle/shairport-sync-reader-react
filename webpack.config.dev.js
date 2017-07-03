var webpack = require('webpack');
var fs = require('fs');
var packageContents = fs.readFileSync('./package.json', 'utf8');
var packageObject = JSON.parse(packageContents);

module.exports = {
  entry: './src/app',
  output: {
    path: __dirname + '/dist/',
    filename: 'app.js',
    publicPath: 'http://localhost:3000/'
  },
  plugins: [
  ],
  module: {
    loaders: [
      {
        // A loader specifically for theme mode...
        test: /\.scss$/,
        include: [/\/scss/],
        exclude: [/node_modules/],
        loader: "style-loader!css-loader!postcss-loader!sass-loader"
      },
      {
        test: /\.scss$/,
        exclude: [/node_modules/, /\/scss/],
        loader: 'style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader!sass-loader'
      },
      {
        test: /\.scss$/,
        include: /node_modules/,
        loader: "style-loader!css-loader!postcss-loader!sass-loader"
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      },
      {
        test: /\.(ttf|eot|woff2?|svg|png|jpe?g|gif|eot)(\?.*)?$/, //the last ? part is for query strings in eg font awesome
        loader: "url-loader?limit=10000000" // Inline for JT
      },
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        exclude: /node_modules/
      }
    ]
  }
};
