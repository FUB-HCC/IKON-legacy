
var hrefGlobal = [	[["BIORES","/pages/projekt1.html"],["MEMIN II","/pages/projekt3.html"],["AMREP II","/pages/projekt6.html"]],
					[["WALVIS II","/pages/projekt2.html"]],
					[["NK365/24","/pages/projekt5.html"]],
					[["NeFo 3","/pages/projekt4.html"]],
				];
function searchProjekt(data,id){
	for (var i = 0; i < data.length; i++) {
		if(data[i].id === id ){
			return data[i];
		}
	}
	return null;
}
//init(callback) - Loads the projects.json
//				   Afterwards it executes this callback with the data as a Parameter

//maybe instead of Netwrork use a data class


init("./res/projects.json",function(data){
	var allProjects = data[0].concat(data[1]).concat(data[2]).concat(data[3]);
	//console.log(allProjects);
	//console.log(allProjects[61]);
	$(document).ready(function() {
		var width = 960, height = 600;
		var stage = new PIXI.Container();
        var renderer = PIXI.autoDetectRenderer(width, height,
            {antialias: !0, transparent: !0, resolution: 1});

        document.body.appendChild(renderer.view);

		createSvg("#chart");


		$("#chart").css('background-color', "#434058");
		var n = new Network(allProjects);
		n.changeVisualisation("geldgeber");
		setTimeout(function() {
			n.changeVisualisation("geldgeber");
		}, 3000);
		//createIcicle(allProjects);
		//createStreamGraph(data,allProjects);
		//createBarChart(allProjects);
		//createTreeMap(allProjects);
		//createBipartiteGraph(searchProjekt(allProjects,"130114"),searchProjekt(allProjects,"110036"),"Test");
	});
});
