const { resolve } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const autoprefixer = require('autoprefixer');

const extractSass = new ExtractTextPlugin({
	filename: '[name].[contenthash].css',
	allChunks: true,
});

module.exports = {
	entry: {
		main: resolve(__dirname, '../app'),
		vendor: [
			'react',
			'react-code-splitting',
			'react-dom',
			'react-helmet',
			'react-redux',
			'react-router-dom',
			'redux',
			'redux-thunk',
		],
	},
	resolve: {
		modules: [resolve(__dirname, '../app'), resolve(__dirname, '../static'), 'node_modules']
	},
	devtool: '#source-map',
	output: {
		filename: '[name].[chunkhash].js',
		path: resolve(__dirname, '../dist'),
		publicPath: '/',
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				include: [resolve(__dirname, '../app'), resolve(__dirname, '../stories')], // stories can be removed once dev utilities is removed
				use: 'babel-loader',
			},
			{
				test: /\.scss$/,
				use: extractSass.extract({
					use: [
						{ loader: 'css-loader', options: { minimize: true } },
						{ loader: 'postcss-loader', options: { plugins: ()=> [autoprefixer] } },
						{ loader: 'sass-loader' },
					],
				})
			},
			{
				test: /\.(woff|woff2)$/,
				use: [
					{ loader: 'url-loader', query: { name: 'fonts/[hash].[ext]', limit: 5000, mimetype: 'application/font-woff' } }
				]
			},
			{
				test: /\.(ttf|eot|svg)$/,
				use: [
					{ loader: 'file-loader', query: { name: 'fonts/[hash].[ext]' } }
				]
			},
			{
				test: /\.json$/,
				loader: 'json-loader'
			}
		],
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('production'),
			},
		}),
		extractSass,
		new webpack.optimize.UglifyJsPlugin({
			compressor: {
				warnings: false,
				screw_ie8: true,
				unused: true,
				dead_code: true,
			},
			sourceMap: true,
		}),
		new webpack.optimize.CommonsChunkPlugin({
			names: ['vendor', 'manifest'],
		}),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			title: 'frankenbook',
			template: 'webpack/template.html',
		}),
		new SWPrecacheWebpackPlugin({
			cacheId: 'frankenbook-cache',
			filename: 'service-worker.js', // This name is referenced in manageServiceWorker.js
			maximumFileSizeToCacheInBytes: 4194304,
			minify: true,
			navigateFallback: '/index.html',
			staticFileGlobs: [
				'static/**.*',
				'static/images/**.*',
			],
			stripPrefix: 'static/',
			mergeStaticsConfig: true, // Merge webpacks static outputs with the globs described above.
			// runtimeCaching: [{
			// 	urlPattern: /^https:\/\/api\.github\.com\//,
			// 	handler: 'fastest',
			// 	networkTimeoutSeconds: 5000,
			// 	options: {
			// 		cache: {
			// 			maxEntries: 10,
			// 			name: 'github-api-cache'
			// 		}
			// 	}
			// }]
		}),
	],
};
