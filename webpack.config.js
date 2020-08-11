const StyleLintPlugin = require('stylelint-webpack-plugin');
const packageJSON = require('./package.json');
const path = require('path');

const DIST = path.resolve("./dist");
const MODE = process.env.NODE_ENV || 'development';

console.log('Webpack mode:', MODE); // eslint-disable-line no-console

const config = {
  devtool: 'source-map',
  entry: [
    './src/index.js'
  ],
  mode: MODE,
  output: {
    filename: `${packageJSON.name}.js`,
    libraryTarget: 'amd',
    path: DIST
  },
  externals: {
    jquery: {
      amd: 'jquery',
      commonjs: 'jquery',
      commonjs2: 'jquery',
      root: '_'
    },
    qlik: {
      amd: 'qlik',
      commonjs: 'qlik',
      commonjs2: 'qlik',
      root: '_'
    }
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: /(node_modules|Library)/,
        loader: "eslint-loader",
        options: {
          failOnError: true
        }
      },
      {
        test: /.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.html$/,
        loader: "html-loader"
      },
     
      {
        test: /\.scss$/,
        use: ['style-loader','css-loader','sass-loader']
      },
      
      /* { 
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'assets/fonts/'
      }},
 */
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            //include: path.resolve(__dirname, '../')
            options: {
              name: '[name].[ext]',
              outputPath: 'assets/fonts/'
            }
          }
        ]
      },
      {
        test: /\.css$/i,
        loader:  'css-loader',
        options: {
          url: false,
        }
      }
    ]
  },
  plugins: [
    new StyleLintPlugin()
  ]
};

module.exports = config;