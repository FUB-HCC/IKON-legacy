var hrefGlobal = [	[["BIORES","/pages/projekt1.html"],["MEMIN II","/pages/projekt3.html"],["AMREP II","/pages/projekt6.html"]],
					[["WALVIS II","/pages/projekt2.html"]],
					[["NK365/24","/pages/projekt5.html"]],
					[["NeFo 3","/pages/projekt4.html"]],
				];
var countries =["Vietnam",
				"Thailand",
				"Ecuador",
				"Nigeria",
				"Äthiopien",
				"Laos",
				"Mexiko",
				"USA",
				"Algerien",
				"Norwegen",
				"Island",
				"Peru",
				"Frankreich",
				"Russland",
				"China"];

//No longer needed if allProjectsJson is used
function searchProjekt(data,id){
	for (var i = 0; i < data.length; i++) {
		if(data[i].id === id ){
			return data[i];
		}
	}
	return null;
}


function loadData(path, callback){
	var xmlhttp = new XMLHttpRequest();
	var url = path;

	xmlhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	        var jsonRes = JSON.parse(this.responseText);
	        callback(jsonRes);
	    }
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();


};

loadData("./res/projects.json",function(data){
	//parse Dates and create Array
	var allProjectsArray = [];
	var allProjectsJson = data;
	for (projectId in allProjectsJson){
    	var endDate = new Date(Date.parse(allProjectsJson[projectId].end));
    	var startDate = new Date(Date.parse(allProjectsJson[projectId].start));
    	allProjectsJson[projectId].end = endDate;
    	allProjectsJson[projectId].start = startDate;
    	allProjectsArray.push(allProjectsJson[projectId]);
    }
	var halfProjectsJson = {};
	var counter = 0;
	for (pId in allProjectsJson) {
		counter++;
		if(counter >=2){
			break;
		}
		halfProjectsJson[pId] = allProjectsJson[pId];
	}
	$(document).ready(function() {
		createSvg("#chart");
		$("#chart").css('background-color', "#434058");

		var r = new RadialChartNew(".svgGlobal",allProjectsJson);
		setTimeout(function(){
			r.updateData(halfProjectsJson);
		},3000);
		setTimeout(function(){
			r.updateData(allProjectsJson);
		},6000);
		//Refactor Network
			//1 Refactor Radial Chart
		//Refactor Streamgraph
		//Create 3D Surface
/*		var t = new TimeLine(".svgGlobal",allProjectsJson);
		setTimeout(function(){
			t.updateData(halfProjectsJson);
		},3000);
		setTimeout(function(){
			t.updateData(allProjectsJson);
		},6000);

		var n = new Network(allProjectsArray);
		n.changeVisualisation("forschungsbereiche");
		setTimeout(function() {
			//Problem with links between Projects on changeVisulisation
			n.changeVisualisation("forschungsbereiche");
		}, 3000);
		createStreamGraph(data,allProjectsArray);
		create3dSurface(allProjectsArray);

		createIcicle(allProjectsArray);
		createTreeMap(allProjectsArray);
		createBipartiteGraph(searchProjekt(allProjectsArray,"130114"),searchProjekt(allProjectsArray,"110036"),"Test");*/
	});
});
