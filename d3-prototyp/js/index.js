
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


$.getJSON("./res/biowikifarm-projects.json", function(biowiki) {

    $.getJSON("./res/newProjects.json", function(json) {
    	console.log(biowiki);
	    for (p in json){
	    	json[p]["beschreibung"] = null
	    	for (var i = 0; i < biowiki.length; i++) {

	    		if(Number(biowiki[i].id) === Number(p)){
	    			json[p]["beschreibung"] = biowiki[i].content
	    		}
	    	}
	    	var myDate = new Date(Date.parse(json[p].end));
	    	console.log(myDate.getFullYear());
	    }
	    console.log(json);
	   	console.log(JSON.stringify(json));
	});
});
init("./res/projects.json",function(data){
	var allProjects = data[0].concat(data[1]).concat(data[2]).concat(data[3]);
	//console.log(allProjects[61]);
	$(document).ready(function() {

		var scene, camera, renderer;

		var WIDTH  = window.innerWidth;
		var HEIGHT = window.innerHeight;

		var SPEED = 0.01;

		function init() {
		    scene = new THREE.Scene();

		    initCube();
		    initCamera();
		    initRenderer();

		    document.body.appendChild(renderer.domElement);
		}

		function initCamera() {
		    camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT, 1, 10);
		    camera.position.set(0, 3.5, 5);
		    camera.lookAt(scene.position);
		}

		function initRenderer() {
		    renderer = new THREE.WebGLRenderer({ antialias: true });
		    renderer.setSize(WIDTH, HEIGHT);
		}

		function initCube() {
		    cube = new THREE.Mesh(new THREE.CubeGeometry(2, 2, 2), new THREE.MeshNormalMaterial());
		    scene.add(cube);
		}

		function rotateCube() {
		    cube.rotation.x -= SPEED * 2;
		    cube.rotation.y -= SPEED;
		    cube.rotation.z -= SPEED * 3;
		    cube.position.z -=0.01;
		}

		function render() {
		    requestAnimationFrame(render);
		    //	console.log("test")
		    rotateCube();
		    renderer.render(scene, camera);
		}

		init();
		render();
		/*createSvg("#chart");


		$("#chart").css('background-color', "#434058");
		create3dSurface(allProjects);*/
		/*var n = new Network(allProjects);
		n.setVisualisation("forschungsbereiche");
		setTimeout(function() {
			n.setVisualisation("forschungsbereiche");
		}, 3000);*/
		//createIcicle(allProjects);
		//createStreamGraph(data,allProjects);
		//createBarChart(allProjects);
		//createTreeMap(allProjects);
		//createBipartiteGraph(searchProjekt(allProjects,"130114"),searchProjekt(allProjects,"110036"),"Test");
	});
});
