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
										'js/lib/d3.3d.min.js',
										'js/lib/d3.chromatic.min.js', //3dSurfaces uses Chromatic for colouring
										'js/lib/x3domfull.js',
										'js/lib/d3-x3dom-axis.js',
										'js/lib/sankey.js', //BipartiteGraph.js uses Sankey
										'js/colorData.js',
										'js/classes/RadialChart.js',
										'js/classes/RadialChartNew.js',//TODO
										'js/classes/ProjectGraph.js',
										'js/classes/Network.js',
										'js/classes/TimeLine.js',
										'js/classes/TreeMap.js',
										'js/classes/BipartiteGraph.js',
										'js/classes/StreamGraph.js',
										'js/classes/Icicle.js',
										'js/classes/3dSurface.js',
										'js/classes/3dSurfacePoints.js',
										'js/helpFunctions.js',
										'js/index.js'
								],
								"bundle.css": [
										'css/main.css',
										'css/x3dom.css'
								]
						}
		})
	]
};