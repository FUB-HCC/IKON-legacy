
init(function(data){
	var allProjects = data[0].concat(data[1]).concat(data[2]).concat(data[3]);
	console.log(allProjects);
	$(document).ready(function() {
		createSvg();
		var n = new Network(allProjects);
		n.changeVisualisation("fachbereiche");
		setTimeout(function() {
			n.changeVisualisation("kooperationspartner");
		}, 3000);
		createBarChart(allProjects);
		//createTreeMap(allProjects);
	});
});
