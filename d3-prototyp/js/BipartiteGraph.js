linksGlobal = [{
			source: 	"forschungsbereich",
			target: 	"forschungsbereich",
			value: 		10,
		},{
			source: 	"forschungsbereich",
			target: 	"hauptthema",
			value: 		7,
		},
		{
			source: 	"hauptthema",
			target: 	"hauptthema",
			value: 		7,
		},
		{
			source: 	"geldgeber",
			target: 	"nebenthemen1",
			value: 		7,
		},
		{
			source: 	"nebenthemen0",
			target: 	"nebenthemen0",
			value: 		7,
		},
		{
			source: 	"start",
			target: 	"start",
			value: 		15,
		}];

function createBipartiteGraph(p1,p2){
	var fbFields=[["Evolution und Geoprozesse","Mikroevolution","Evolutionäre Morphologie","Diversitätsdynamik","Impakt- und Meteoritenforschung"],
		["Sammlungsentwicklung und Biodiversitätsentdeckung","Biodiversitätsentdeckung","Sammlungsentwicklung","Kompetenzzentrum Sammlung"],
		["Digitale Welt und Informationswissenschaft","IT- Forschungsinfrastrukturen","Wissenschaftsdatenmanagement","Biodiversitäts- und Geoinformatik"],
		["Wissenschaftskommunikation und Wissensforschung","Ausstellung und Wissenstransfer","Bildung und Vermittlung","Wissenschaft in der Gesellschaft","Perspektiven auf Natur - PAN","Historische Arbeitsstelle"]];
	/*var svgDefs = svgGlobal.append('defs');

    var mainGradient = svgDefs.append('linearGradient')
        .attr('id', 'myGradient');

    // Create the stops of the main gradient. Each stop will be assigned
    // a class to style the stop using CSS.
    mainGradient.append('stop')
        .attr('stop-color','#009688')
        .attr('offset', '0');

    mainGradient.append('stop')
        .attr('stop-color','#3f51b5')
        .attr('offset', '1');*/

	var height = svgGlobal.attr("height")/2,
	    width = svgGlobal.attr("width")/4;

	var format = function(d) { return d + " Stimmen"; },
	    color = d3.scaleOrdinal(d3.schemeCategory20);

	var gAll = svgGlobal.append("g")
						.attr("width", width)
					    .attr("height", height)
						.attr("class", "svgchart")
						.attr("transform",
						 	 "translate(" + (svgGlobal.attr("width")/4) + "," + (svgGlobal.attr("height")/8) + ")");

	var sankey = d3.sankey()
	    .nodeWidth(30)
	    .nodePadding(17)
	    .size([width, height]);

	var path = sankey.link();
	var fbColor = ["#7d913c","#d9ef36","#8184a7","#985152"];
	function parseFb(neben){
		if(neben === null || neben === undefined){
			return "#f0faf0";
		}else{

			for (var i = 0; i < fbFields.length; i++) {
				if(fbFields[i].indexOf(neben) > -1){
					return fbColor[i];
				}
			}
			return "#99aaff";
		}

	}
	/*var div = d3.select("body").append("div")
	    .attr("class", "tooltip")
	    .style("opacity", 0);*/
	var color = d3.scaleOrdinal()
	    .domain(["forschungsbereich",".forschungsbereich","hauptthema",".hauptthema","projektleiter",".projektleiter","titel",".titel"
	    	,"nebenthemen0",".nebenthemen0","nebenthemen1",".nebenthemen1","nebenthemen2",".nebenthemen2","nebenthemen3",".nebenthemen3"
	    	,"start",".start","geldgeber",".geldgeber","kooperationspartner",".kooperationspartner"])
	    .range([fbColor[p1.forschungsbereich-1],fbColor[p2.forschungsbereich-1], fbColor[p1.forschungsbereich-1], fbColor[p2.forschungsbereich-1], fbColor[p1.forschungsbereich-1], fbColor[p2.forschungsbereich-1], fbColor[p1.forschungsbereich-1], fbColor[p2.forschungsbereich-1]
	    	, parseFb(p1.nebenthemen[0]), parseFb(p2.nebenthemen[0]), parseFb(p1.nebenthemen[1]), parseFb(p2.nebenthemen[1]), parseFb(p1.nebenthemen[2]), parseFb(p2.nebenthemen[2]), parseFb(p1.nebenthemen[3]), parseFb(p2.nebenthemen[3])
	    	, "#f0faf0","#f0faf0","#f0faf0","#f0faf0", "#f0faf0","#f0faf0"]);
	    // ["#7d913c","#d9ef36","#8184a7","#985152"]

	var rect;
	var node;
	var link;

	var nodeNames = ["titel",".titel","projektleiter",".projektleiter","forschungsbereich",".forschungsbereich",
			"hauptthema",".hauptthema","nebenthemen",".nebenthemen","start",".start","geldgeber",".geldgeber",
			"kooperationspartner",".kooperationspartner"];

	graph = {"nodes" : [{"name":"junk"},{"name":".junk"}],
			 "links" : []};


	graph.links.push({  "source": "junk",
						"target": ".junk",
						"color": "none",
                    	"value": 0.01});

	linksGlobal.forEach(function (d) {
		graph.links.push({  "source": d.source,
							"target": "."+d.target,
							"color": "#faf0fa",
                        	"value": +d.value });
    });

	nodeNames.forEach(function (d) {
		if(d.substring(1)==="nebenthemen"){
			for (var i = 0; i < p2.nebenthemen.length; i++) {
				graph.nodes.push({"name":".nebenthemen"+i});
	    		graph.links.push({  "source": "junk",
								"target": ".nebenthemen"+i,
								"color": "none",
	                        	"value": 0.01});

			}
		}else if(d==="nebenthemen"){
			for (var i = 0; i < p1.nebenthemen.length; i++) {
				graph.nodes.push({"name":"nebenthemen"+i});
	    		graph.links.push({  "source": "nebenthemen"+i,
								"target": ".junk",
								"color": "none",
	                        	"value": 0.01});
			}
		}else{
    		graph.nodes.push({"name":d});
    		if(d.substring(0,1)=="."){
	    		graph.links.push({  "source": "junk",
								"target": d,
								"color": "none",
	                        	"value": 0.01});
			}else{
	    		graph.links.push({  "source": d,
								"target": ".junk",
								"color": "none",
	                        	"value": 0.01});
	    	}
    	}



	});

    graph.nodes = d3.keys(d3.nest()
    		.key(function (d) { return d.name; })
    		.object(graph.nodes));

    graph.links.forEach(function (d, i) {
    	graph.links[i].source = graph.nodes.indexOf(graph.links[i].source);
    	graph.links[i].target = graph.nodes.indexOf(graph.links[i].target);
    });
    graph.nodes.forEach(function (d, i) {
    	if(d.substring(1,12)==="nebenthemen"){
    		graph.nodes[i] = { "name": d, "text": p2.nebenthemen[d.substring(12)]};
		}else if(d.substring(0,11)==="nebenthemen"){
			graph.nodes[i] = { "name": d, "text": p1.nebenthemen[d.substring(11)]};
		}else{
	    	if(d.substring(0,1)==="."){
	    		graph.nodes[i] = { "name": d, "text": p2[d.substring(1)]};
	    	}else{
	    		graph.nodes[i] = { "name": d, "text": p1[d]};
	    	}
	    }
    	var n = graph.nodes[i];
    	if(n.name=="junk"||n.name==".junk"){
      		n.text = "";
      	}else if (n.name == "titel"||n.name == ".titel"){
      		n.text = n.text.substring(0,40)+" ..."
      	}else if(n.name == "forschungsbereich"||n.name == ".forschungsbereich"){
      		n.text = "Forschungsbereich "+ n.text;
      	}else if (n.name == "start"||n.name == ".start"){
      		var nt = n.text;
      		if(n.name.substring(0,1)==="."){
      			var n2t = p1["end"];
      		}else{
      			var n2t = p2["end"];
      		}
      		n.text = nt.getDate() + "." + (nt.getMonth() + 1) + "." + nt.getFullYear()+" - "+
      				n2t.getDate() + "." + (n2t.getMonth() + 1) + "." + n2t.getFullYear();
      	}
    });
  	sankey.nodes(graph.nodes)
    		.links(graph.links)
    		.layout(0);
	link = gAll.append("g").selectAll(".link")
		      .data(graph.links)
		    .enter().append("path")
		      .attr("class", "linksankey")
		      .attr("d",function(d) {
		      	console.log(d.sy - d.ty);
		      	if(d.sy - d.ty <= 0.1 ||d.sy - d.ty >= -0.1) {
		      	  //gradient does not render when path horizontal

			   	  d.sy += 0.001;
			   	  //d.ty -= 0.01;
			    }
			    return path(d);
		      })
			  .attr("id", function(d) { return "link" + d.source.name; })
		      .style("stroke-width", function(d) { return Math.max(1, d.dy); })
			//  .style("stroke", function(d) { return d.color; });
			  .style('stroke', function(d) {

		          var sourceColor = color(d.source.name).replace("#", "");
		          var targetColor = color(d.target.name).replace("#", "");
		          var id = 'c-' + sourceColor + '-to-' + targetColor;
		          if (svgGlobal.select("#"+id).empty()) {
		            //append the gradient def
		            //append a gradient
		            var gradient = svgGlobal.append('defs')
		              .append('linearGradient')
		              .attr('id', id)
		              .attr('x1', '0%')
		              .attr('y1', '0%')
		              .attr('x2', '100%')
		              .attr('y2', '0%')
		              .attr('spreadMethod', 'pad');

		            gradient.append('stop')
		              .attr('offset', '0%')
		              .attr('stop-color', "#" + sourceColor)
		              .attr('stop-opacity', 1);

		            gradient.append('stop')
		              .attr('offset', '100%')
		              .attr('stop-color', "#" + targetColor)
		              .attr('stop-opacity', 1);
		            //gradient.attr('gradientUnits', "userSpaceOnUse")
		          }


		          if(d.color === "none"){
		          	return "none";
		          }
		          return "url(#" + id + ")";
		        });
	link.on("mouseover", function(d) {
            /*div.transition()
                .duration(200)
                .style("opacity", .9);
            div .html("<b>" + d.source.name + "</b> -> <b>"  + d.target.name + "</b><br/>" + format(d.value))
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 32) + "px");*/

			link.transition()
		        .duration(700)
				.style("opacity", .1);
			link.filter(function(s) { return d.source.name == s.source.name
						&& d.target.name == s.target.name; }).transition()
            	.duration(700)
				.style("opacity", 1);
	})
        .on("mouseout", function(d) {
            /*div.transition()
                .duration(500)
                .style("opacity", 0);*/

            gAll.selectAll(".linksankey").transition()
        		.duration(700)
				.style("opacity", 1)
    });

	node = gAll.append("g").selectAll(".node")
	      .data(graph.nodes)
	    .enter().append("g")
	      .attr("class", "nodesankey")
	      .attr("transform", function(d) {
	      		/*if(d.name.substring(0,1) !== "."){
	      			d.x=0;
	      		}*/
			  return "translate(" + d.x + "," + d.y + ")"; });

	rect = node.append("rect")
	      .attr("height", function(d) {
	      	if(d.name=="junk"||d.name==".junk"){
	      		return 0;
	      	}
	      	if(d.dy < 0.5){
	      		return 10;
	      	}
	      	return d.dy;
	      })
	      .attr("width", sankey.nodeWidth())
	      .style("fill", function(d) {
	      	return color(d.name); });

	rect.on("mouseover", function(d) {
	            /*div.transition()
	                .duration(200)
	                .style("opacity", .9);
	            div .html("<b>" + d.name + "</b>:<br/>" + format(d.value))
	                .style("left", (d3.event.pageX) + "px")
	                .style("top", (d3.event.pageY - 28) + "px");*/
	            })
	        .on("mouseout", function(d) {
	            /*div.transition()
	                .duration(500)
	                .style("opacity", 0);*/
	        });

	  node.append("text")
	      .attr("x", 40)
	      .attr("y", function(d) { return d.dy / 2; })
	      .attr("dy", ".35em")
	      .attr("text-anchor", "start")
	      .attr("transform", null)
	      .style("fill",function(d) {
	      	return color(d.name);
	      })
	      .text(function(d) {
	      	return d.text; })
		  .attr("class", "graph")
	    .filter(function(d) { return d.x < width / 2; })
	      .attr("x", -40 + sankey.nodeWidth())
	      .attr("text-anchor", "end");

	// Fade-Effect on mouseover
	node.on("mouseover", function(d) {
		link.transition()
	        .duration(700)
			.style("opacity", .1);
		link.filter(function(s) { return d.name == s.source.name; }).transition()
	        .duration(700)
			.style("opacity", 1);
		link.filter(function(t) { return d.name == t.target.name; }).transition()
	        .duration(700)
			.style("opacity", 1);
	})
		.on("mouseout", function(d) { gAll.selectAll(".linksankey").transition()
        	.duration(700)
			.style("opacity", 1)
	});
}