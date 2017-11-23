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
										'js/lib/jquery.min.js',
										'js/lib/d3.min.js',
										'js/lib/sankey.js',
										'js/classes/RadialChart.js',
										'js/classes/ProjectGraph.js',
										'js/classes/Network.js',
										'js/classes/TimeLine.js',
										'js/classes/TreeMap.js',
										'js/classes/BipartiteGraph.js',
										'js/classes/StreamGraph.js',
										'js/helpFunctions.js',
										'js/loadData.js',
										'js/index.js'
								],
								"bundle.css": [
										'css/main.css'
								]
						}
		})
	]
};