data1 = [{
			source: 	"forschungsbereich",
			target: 	"forschungsbereich",
			value: 		10,
		},
		{
			source: 	"forschungsbereich",
			target: 	"hauptthema",
			value: 		7,
		},
		{
			source: 	"geldgeber",
			target: 	"kooperationspartner",
			value: 		7,
		},
		{
			source: 	"nebenthemen",
			target: 	"nebenthemen",
			value: 		7,
		},
		{
			source: 	"start",
			target: 	"start",
			value: 		15,
		}]

function createBipartiteGraph(p1,p2){
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
	    width = svgGlobal.attr("width")/2;

	var format = function(d) { return d + " Stimmen"; },
	    color = d3.scaleOrdinal(d3.schemeCategory20);

	var gAll = svgGlobal.append("g")
						.attr("width", width)
					    .attr("height", height)
						.attr("class", "svgchart")
						.attr("transform",
						 	 "translate(" + (width/2) + "," + (height/2) + ")");

	var sankey = d3.sankey()
	    .nodeWidth(30)
	    .nodePadding(17)
	    .size([width, height]);

	var path = sankey.link();

	/*var div = d3.select("body").append("div")
	    .attr("class", "tooltip")
	    .style("opacity", 0);*/

	var color = d3.scaleOrdinal()
	    .domain(["forschungsbereich",".forschungsbereich","hauptthema",".hauptthema","nebenthemen",".nebenthemen","start",".start","geldgeber",".geldgeber","kooperationspartner",".kooperationspartner"])
	    .range(["#985152","#985152", "#7d913c", "#7d913c", "#8184a7","#8184a7", "#d9ef36","#d9ef36","#985152","#985152", "#7d913c","#7d913c"]);
	    // , "grey","#985152","#7d913c","#8184a7","#d9ef36"

	var rect;
	var node;
	var link;

	var nodeNames = ["forschungsbereich",".forschungsbereich","hauptthema",".hauptthema",
			"nebenthemen",".nebenthemen","start",".start","end",".end","geldgeber",".geldgeber",
			"kooperationspartner",".kooperationspartner","antragsteller",".antragsteller",
			"projektleiter",".projektleiter","titel",".titel"];

	graph = {"nodes" : [{"name":"junk"},{"name":".junk"}],
			 "links" : []};

	data1.forEach(function (d) {
		graph.links.push({  "source": d.source,
							"target": "."+d.target,
							"color": "#faf0fa",
                        	"value": +d.value });
    });



	nodeNames.forEach(function (d) {
    	graph.nodes.push({"name":d})
    	//if( !graph.links.some(item => item.source === d.substring(1))
    	//	&& !graph.links.some(item => item.target === d)){
	    	if(d.substring(0,1)=="."){
	    		graph.links.push({  "source": "junk",
								"target": d,
								"color": "none",
	                        	"value": 5});
	    	}else{
	    		graph.links.push({  "source": d,
								"target": ".junk",
								"color": "none",
	                        	"value": 5});
	    	}
    	//}

	});


    graph.nodes = d3.keys(d3.nest()
    		.key(function (d) { return d.name; })
    		.object(graph.nodes));
    graph.links.forEach(function (d, i) {
    	graph.links[i].source = graph.nodes.indexOf(graph.links[i].source);
    	graph.links[i].target = graph.nodes.indexOf(graph.links[i].target);
    });
    graph.nodes.forEach(function (d, i) {
    	if(d.substring(0,1)==="."){
    		graph.nodes[i] = { "name": d, "text": p1[d.substring(1)]};
    	}else{
    		graph.nodes[i] = { "name": d, "text": p2[d]};
    	}

    });
    console.log(graph);
  	sankey.nodes(graph.nodes)
    		.links(graph.links)
    		.layout(32);

	link = gAll.append("g").selectAll(".link")
		      .data(graph.links)
		    .enter().append("path")
		      .attr("class", "linksankey")
		      .attr("d", path)
			  .attr("id", function(d) { return "link" + d.source.name; })
		      .style("stroke-width", function(d) { return Math.max(1, d.dy); })
			  .style("stroke", function(d) { return d.color; });
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
	      	/*if(d.dy == 0){
	      		return 10;
	      	}*/
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
	      	if(d.name=="junk"||d.name==".junk"){
	      		return "";
	      	}
	      	if(d.name == "forschungsbereich"||d.name == ".forschungsbereich"){
	      		return "Forschungsbereich "+ d.text;
	      	}else if (d.name == "start"||d.name == ".start"||d.name == "end"||d.name == ".end"){
	      		var dt = d.text;
	      		return  dt.getDate() + "." + (dt.getMonth() + 1) + "." + dt.getFullYear();
	      	}
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