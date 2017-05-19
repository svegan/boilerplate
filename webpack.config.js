export default (devTool) => {
  return {
    output: {
      filename: 'common.js',
    },
    devtool: devTool,
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: ['node_modules'],
          loader: 'babel-loader',
        },
        {
          test: require.resolve('./src/js/modules/svg/svg4everybody'),
          loader: 'imports-loader?this=>window'
        }
      ]
    }
  };
};
