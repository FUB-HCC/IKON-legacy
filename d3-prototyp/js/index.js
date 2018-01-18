
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


var countries =["Andorra",
		"Vereinigte Arabische Emirate",
"Afghanistan",
"Antigua und Barbuda",
"Anguilla",
"Albanien",
"Armenien",
"Niederländische Antillen",
"Angola",
"Antarktis",
"Argentinien",
"Amerikanisch-Samoa",
"Österreich (Austria)",
"Australien",
"Aruba",
"Azerbaijan",
"Bosnien-Herzegovina",
"Barbados",
"Bangladesh",
"Belgien",
"Burkina Faso",
"Bulgarien",
"Bahrain",
"Burundi",
"Benin",
"Bermudas",
"Brunei Darussalam",
"Bolivien",
"Brasilien",
"Bahamas",
"Bhutan",
"Bouvet Island",
"Botswana",
"Weißrußland (Belarus)",
"Belize",
"Canada",
"Cocos (Keeling) Islands",
"Demokratische Republik Kongo",
"Zentralafrikanische Republik",
"Kongo",
"Schweiz",
"Elfenbeinküste (Cote D'Ivoire)",
"Cook Islands",
"Chile",
"Kamerun",
"China",
"Kolumbien",
"Costa Rica",
"Tschechoslowakei (ehemalige)",
"Kuba",
"Kap Verde",
"Christmas Island",
"Zypern",
"Tschechische Republik",
"Deutschland",
"Djibouti",
"Dänemark",
"Dominica",
"Dominikanische Republik",
"Algerien",
"Ecuador",
"Estland",
"Ägypten",
"Westsahara",
"Eritrea",
"Spanien",
"Äthiopien",
"Finnland",
"Fiji",
"Falkland-Inseln (Malvinas)",
"Micronesien",
"Faröer-Inseln",
"Frankreich",
"France, Metropolitan",
"Gabon",
"Grenada",
"Georgien",
"Französisch Guiana",
"Ghana",
"Gibraltar",
"Grönland",
"Gambia",
"Guinea",
"Guadeloupe",
"Äquatorialguinea",
"Griechenland",
"Südgeorgien und Südliche Sandwich-Inseln",
"Guatemala",
"Guam",
"Guinea-Bissau",
"Guyana",
"Kong Hong",
"Heard und Mc Donald Islands",
"Honduras",
"Haiti",
"Ungarn",
"Indonesien",
"Irland",
"Israel",
"Indien",
"British Indian Ocean Territory",
"Irak",
"Iran (Islamische Republik)",
"Island",
"Italien",
"Jamaica",
"Jordanien",
"Japan",
"Kenya",
"Kirgisien",
"Königreich Kambodscha",
"Kiribati",
"Komoren",
"Saint Kitts und Nevis",
"Korea, Volksrepublik",
"Korea",
"Kuwait",
"Kayman Islands",
"Kasachstan",
"Laos",
"Libanon",
"Saint Lucia",
"Liechtenstein",
"Sri Lanka",
"Liberia",
"Lesotho",
"Littauen",
"Luxemburg",
"Lettland",
"Libyen",
"Marokko",
"Monaco",
"Moldavien",
"Madagaskar",
"Marshall-Inseln",
"Mazedonien, ehem. Jugoslawische Republik",
"Mali",
"Myanmar",
"Mongolei",
"Macao",
"Nördliche Marianneninseln",
"Martinique",
"Mauretanien",
"Montserrat",
"Malta",
"Mauritius",
"Malediven",
"Malawi",
"Mexico",
"Malaysien",
"Mozambique",
"Namibia",
"Neu Kaledonien",
"Niger",
"Norfolk Island",
"Nigeria",
"Nicaragua",
"Niederlande",
"Norwegen",
"Nepal",
"Nauru",
"Niue",
"Neuseeland",
"Oman",
"Panama",
"Peru",
"Französisch Polynesien",
"Papua Neuguinea",
"Philippinen",
"Pakistan",
"Polen",
"St. Pierre und Miquelon",
"Pitcairn",
"Puerto Rico",
"Portugal",
"Palau",
"Paraguay",
"Katar",
"Reunion",
"Rumänien",
"Russische Föderation",
"Ruanda",
"Saudi Arabien",
"Salomonen",
"Seychellen",
"Sudan",
"Schweden",
"Singapur",
"St. Helena",
"Slovenien",
"Svalbard und Jan Mayen Islands",
"Slowakei",
"Sierra Leone",
"San Marino",
"Senegal",
"Somalia",
"Surinam",
"Sao Tome und Principe",
"El Salvador",
"Syrien, Arabische Republik",
"Swaziland",
"Turk und Caicos-Inseln",
"Tschad",
"Französisches Südl.Territorium",
"Togo",
"Thailand",
"Tadschikistan",
"Tokelau",
"Turkmenistan",
"Tunesien",
"Tonga",
"Ost-Timor",
"Türkei",
"Trinidad und Tobago",
"Tuvalu",
"Taiwan",
"Tansania, United Republic of",
"Ukraine",
"Uganda",
"Großbritannien",
"Vereinigte Staaten",
"Vereinigte Staaten, Minor Outlying Islands",
"Uruguay",
"Usbekistan",
"Vatikanstaat",
"Saint Vincent und Grenadines",
"Venezuela",
"Virgin Islands (Britisch)",
"Virgin Islands (U.S.)",
"Vietnam",
"Vanuatu",
"Wallis und Futuna Islands",
"Samoa",
"Jemen",
"Mayotte",
"Jugoslawien",
"Südafrika",
"Sambia",
"Zimbabwe"]

$.getJSON("./res/newProjects.json", function(json) {
    for (p in json){
    	var c="";
    	if(Math.random() < 0.6){
    		c = "Deutschland";
    	}else{
    		c = countries[parseInt(Math.random()*countries.length)];
    		console.log(parseInt(Math.random()*countries.length));
    	}
    	json[p]["forschungsregion"] = c;
    	var myDate = new Date(Date.parse(json[p].end));
    	console.log(myDate.getFullYear());
    }

    console.log(json);
    console.log(JSON.stringify(json));
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
