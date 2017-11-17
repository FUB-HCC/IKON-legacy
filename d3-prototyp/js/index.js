
var hrefGlobal = [	[["BIORES","/pages/projekt1.html"],["MEMIN II","/pages/projekt3.html"],["AMREP II","/pages/projekt6.html"]],
					[["WALVIS II","/pages/projekt2.html"]],
					[["NK365/24","/pages/projekt5.html"]],
					[["NeFo 3","/pages/projekt4.html"]],
				];
//init(callback) - Loads the projects.json
//				   Afterwards it executes this callback with the data as a Parameter

//maybe instead of Netwrork use a data class


init("./res/projects.json",function(data){
	var allProjects = data[0].concat(data[1]).concat(data[2]).concat(data[3]);
	//console.log(allProjects);
	//console.log(allProjects[61]);
	$(document).ready(function() {

		createSvg("#chart");
		$("#chart").css('background-color', "#434058");
		/*var n = new Network(allProjects);
		n.changeVisualisation("forschungsbereiche");
		setTimeout(function() {
			//n.changeVisualisation("kooperationspartner");
		}, 3000);*/
		//createBarChart(allProjects);
		//createTreeMap(allProjects);
		console.log(allProjects);
		createBipartiteGraph(allProjects[84],allProjects[61]);
	});
});
