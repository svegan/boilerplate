export default {
  output: {
    filename: 'common.js',
  },
  devtool: process.env.NODE_ENV !== 'production' ? 'source-map' : false,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: ['node_modules'],
        loader: 'babel-loader',
      },
      {
        test: require.resolve('./src/js/modules/polyfills/svg4everybody'),
        loader: 'imports-loader?this=>window'
      }
    ]
  },
  /* resolve: {
		extensions: ['.js', '.json'],
		alias: {
			'utils': path.resolve('src/js/modules/utils.js')
		}
	},*/
  /* plugins: [
		// Provides jQuery for other JS bundled with Webpack
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery'
		})
	]*/
};
