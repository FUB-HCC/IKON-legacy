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
function subJson(allProjectsJson,num){
	var halfProjectsJson = {};
	var counter = 0;
	for (pId in allProjectsJson) {
		counter++;
		if(counter >=num){
			break;
		}
		halfProjectsJson[pId] = allProjectsJson[pId];
	}
	console.log(halfProjectsJson);
	return halfProjectsJson;
}
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

	$(document).ready(function() {
		createSvg("#chart");
		$("#chart").css('background-color', "#434058");

		//var r = new ProjectGraphNew(".svgGlobal",allProjectsJson);
		/*setTimeout(function(){
			r.updateData(halfProjectsJson);
		},3000);
		setTimeout(function(){
			r.updateData(allProjectsJson);
		},6000);*/
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
		},6000);*/
		/*var r = new ProjectGraphNew(".svgGlobal",allProjectsJson);
		setTimeout(function(){
			r.updateData(subJson(allProjectsJson,2));
		},3000);
		setTimeout(function(){
			r.updateData(subJson(allProjectsJson,5));
		},6000);
		setTimeout(function(){
			r.updateData(subJson(allProjectsJson,10));
		},9000);
		setTimeout(function(){
			r.updateData(subJson(allProjectsJson,30));
		},12000);
		setTimeout(function(){
			r.updateData(subJson(allProjectsJson,50));
		},15000);
		setTimeout(function(){
			r.updateData(subJson(allProjectsJson,70));
		},18000);
		setTimeout(function(){
			r.updateData(subJson(allProjectsJson,90));
		},21000);
		setTimeout(function(){
			r.updateData(subJson(allProjectsJson,100));
		},24000);*/
		var n = new NetworkNew(".svgGlobal",allProjectsJson);
		setTimeout(function(){
			n.updateData(subJson(allProjectsJson,2));
		},3000);
		setTimeout(function(){
			n.updateData(subJson(allProjectsJson,5));
		},6000);
		setTimeout(function(){
			n.updateData(subJson(allProjectsJson,10));
		},9000);
		setTimeout(function(){
			n.updateData(subJson(allProjectsJson,30));
		},12000);
		setTimeout(function(){
			n.updateData(subJson(allProjectsJson,50));
		},15000);
		setTimeout(function(){
			n.updateData(subJson(allProjectsJson,70));
		},18000);
		setTimeout(function(){
			n.updateData(subJson(allProjectsJson,90));
		},21000);
		setTimeout(function(){
			n.updateData(subJson(allProjectsJson,100));
		},24000);
		/*var n = new Network(allProjectsArray);
		n.changeVisualisation("forschungsbereiche");
		setTimeout(function() {
			//Problem with links between Projects on changeVisulisation
			n.changeVisualisation("forschungsbereiche");
		}, 3000);*//*
		createStreamGraph(data,allProjectsArray);
		create3dSurface(allProjectsArray);

		createIcicle(allProjectsArray);
		createTreeMap(allProjectsArray);
		createBipartiteGraph(searchProjekt(allProjectsArray,"130114"),searchProjekt(allProjectsArray,"110036"),"Test");*/
	});
});
