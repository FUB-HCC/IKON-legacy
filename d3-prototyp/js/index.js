
//init(callback) - Loads the projects.json
//				   Afterwards it executes this callback with the data as a Parameter
init(function(data){
	var allProjects = data[0].concat(data[1]).concat(data[2]).concat(data[3]);
	//console.log(allProjects);
	//console.log(allProjects[61]);
	$(document).ready(function() {
		createSvg();
		var n = new Network(allProjects);
		n.changeVisualisation("forschungsbereiche");
		setTimeout(function() {
			//n.changeVisualisation("kooperationspartner");
		}, 3000);
		//createBarChart(allProjects);
		//createTreeMap(allProjects);
		//createBipartiteGraph(allProjects[0],allProjects[1]);
	});
});
