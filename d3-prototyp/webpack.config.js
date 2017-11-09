const path = require('path');
const MergeIntoSingleFilePlugin = require('webpack-merge-and-include-globally');

module.exports = {
	context: __dirname,
	entry: './js/index.js',
	output: {
		filename: '[name]',
		path: path.resolve(__dirname, 'dist'),
	},
	plugins: [
		new MergeIntoSingleFilePlugin({
			files: {
								"bundle.js": [
										'js/jquery.min.js',
										'js/d3.min.js',
										'js/viz.v1.1.0.min.js',
										'js/helpFunctions.js',
										'js/loadData.js',
										'js/RadialChart.js',
										'js/ProjectGraph.js',
										'js/Network.js',
										'js/TimeLine.js',
										'js/TreeMap.js',
										'js/BipartiteGraph.js',
										'js/index.js'
								],
								"bundle.css": [
										'css/main.css'
								]
						}
		})
	]
};