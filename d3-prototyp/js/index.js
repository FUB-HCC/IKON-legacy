
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

		/*createSvg("#chart");


		$("#chart").css('background-color', "#434058");*/

		/*var width = $("#chart").width(), height = $("#chart").height()-4;

        var stage = new PIXI.Container();
        var renderer = PIXI.autoDetectRenderer(width, height,
            {antialias: !0, transparent: !0, resolution: 1});
        document.getElementById("chart").appendChild(renderer.view);
	    var semicircle = new PIXI.Graphics();
	    semicircle.beginFill(0xffffff,0);
	    semicircle.lineStyle(20, 0xff00ff,1);
	    semicircle.arc(0, 0, 100, 0, Math.PI); // cx, cy, radius, startAngle, endAngle
	    semicircle.position = {x: width/2, y: height/2};
	    stage.addChild(semicircle);
	    count=0;

	    //animate for temporary Animation
	    //otherwise PIXIS TICKER
		function animate(){


	      	// Rotation is measured in radians. Math.PI * 2 = one full rotation.
	      	semicircle.clear();
	      	semicircle.rotation = (Date.now() / 1000) % (Math.PI * 2);
	      	semicircle.beginFill(0xffffff,0);
	    	semicircle.lineStyle(20, 0xff00ff,1);
	    	semicircle.arc(0, 0, 100, Math.radians(count%360), Math.PI);
	      	renderer.render(stage);
	      	count++;
	    	if(count<60*2){
	    		console.log(count)

	    	}
	    	requestAnimationFrame(animate);

	    }
	   	animate();*/
		var n = new NetworkPIXI(allProjects);
		n.setVisualisation("forschungsbereiche");
		/*setTimeout(function() {
			n.setVisualisation("forschungsbereiche");
		}, 3000);*/
		//createIcicle(allProjects);
		//createStreamGraph(data,allProjects);
		//createBarChart(allProjects);
		//createTreeMap(allProjects);
		//createBipartiteGraph(searchProjekt(allProjects,"130114"),searchProjekt(allProjects,"110036"),"Test");
	});
});
