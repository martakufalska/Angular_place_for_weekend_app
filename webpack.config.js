var path = require('path');
var webpack = require('webpack');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin'); 
module.exports = {
    entry: {
        'polyfills': './src/polyfills.ts',
        'app': './src/main.ts'
      },
   output:{
       path: path.resolve(__dirname, './public'),   
       publicPath: '/public/',
       filename: "[name].js"      
   },
   resolve: {
    extensions: ['.ts', '.js', '.html','.css', '.styl', '.scss', '.less']
  },
   module:{
    loaders: [
        {
          test: /\.ts$/,
          loaders: ['awesome-typescript-loader', 'angular2-template-loader?keepUrl=true'],
          exclude: [/\.(spec|e2e)\.ts$/]
        },
        { 
          test: /\.(html|css)$/, 
          loader: 'raw-loader',
          exclude: /\.async\.(html|css)$/
        },
        /* Async loading. */
        {
          test: /\.async\.(html|css)$/, 
          loaders: ['file?name=[name].[hash].[ext]', 'extract']
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          use: ['style-loader', 'css-loader'],
        }, 
        { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' }
      
      ],
       rules:[  
           {
               test: /\.ts$/, 
               use: [
                {
                    loader: 'awesome-typescript-loader',
                    options: { configFileName: path.resolve(__dirname, 'tsconfig.json') }
                  } ,
                   'angular2-template-loader'
               ]
            },
            {
                test: /\.(html)$/,
                use: {
                loader: 'html-loader',
                }
            }
       ]
   },
   plugins: [
    new webpack.ContextReplacementPlugin(
        /angular(\\|\/)core/,
        path.resolve(__dirname, 'src'), 
      {} 
    ),
    new webpack.optimize.CommonsChunkPlugin({
        name: ['app', 'polyfills']
      }),
    new UglifyJSPlugin()
  ]
}