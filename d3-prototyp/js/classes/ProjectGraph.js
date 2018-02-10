var linksP = [{
			source: 	"110048",
			target: 	"130119",
			value: 		9
		},{
			source: 	"130119",
			target: 	"170000",
			value: 		9
		},
		{
			source: 	"170000",
			target: 	"130116",
			value: 		9
		},
		{
			source: 	"170000",
			target: 	"140019",
			value: 		9
		},
		{
			source: 	"170000",
			target: 	"130108",
			value: 		9
		},
		{
			source: 	"130108",
			target: 	"130116",
			value: 		9
		},
		{
			source: 	"160012",
			target: 	"130116",
			value: 		9
		},
		{
			source: 	"110050",
			target: 	"110046",
			value: 		9
		},
		{
			source: 	"110046",
			target: 	"160016",
			value: 		9
		},
		{
			source: 	"110050",
			target: 	"110048",
			value: 		9
		}];
class ProjectGraph{
	//Erstellt für alle Projekte einen Graphen und bewegt die Projekte an ihre richtige Position im Kreis.

	constructor() {
		//groups [{text:"",percentage:0,percentageSum:0,color:"",projects:[]},...]
		this.groups = null;
		//groupSectors [{startAngle:0,endAngle:0,flowPoint:{},outerRadius:0,circleMiddle:{}},...]
		this.groupSectors = null;
		//poiintData [{color:"", groupNum: 0, project:{},sector:{}},...]
		this.pointData = null;
		this.force = null;
		this.counter =0;
	}

	createForceSimulation(){
		/*
			Erstellt alle benötigten d3 elemente.

			Gibt die forceSimulation zurück.
				(Schlechte Namenwahl aufsplitten in 2 Funktionen)
		*/
		var that = this;
		var scaleX = d3.scaleLinear()
		        .domain([-30,30])
		        .range([0,600]);
		var scaleY = d3.scaleLinear()
		        .domain([0,50])
		        .range([500,0]);
		var tmpForce = d3.forceSimulation()
			.force("link", d3.forceLink().id(function(d) { return d.project.id; }))
		    .force("collide", d3.forceCollide(19))
		    .force("center", d3.forceCenter(svgGlobal.attr("width") / 2, svgGlobal.attr("height") / 2));
		svgGlobal.append('circle')
				.attr("class","background")
   				.style("fill","#f0faf0")
		  		.style("opacity",0)
		  		.attr("r", 220)
		  		.attr('cx', svgGlobal.attr("width") / 2)
		  		.attr('cy', svgGlobal.attr("height") / 2);

		var toolTip = d3.select("body").append("div")
    		.attr("class", "tooltip")
    		.style("opacity", 0);


    	var link = svgGlobal.append("g")
				      .attr("class", "links")
				    .selectAll("line")
				    .data(linksP)
				    .enter().append("line")
				      .attr("stroke-width", function(d) { return Math.sqrt(d.value); })
				      .style("opacity", 0);
		var allNodes = svgGlobal.selectAll(".nodeGroup")
		    .data(that.pointData).enter()
		    .append("g")
		    	.attr("class","nodeGroup");

		allNodes.append("circle")
		    .attr("class", "node")
		    .attr("r", 10)
		    .attr("fill", function(d) {
		        return d.color;
		    })
		    .style("stroke", "")
		    .style("opacity", 0)
		    .style("stroke-width", "1px");
		allNodes.append("polygon")
		    .attr("points",function(d){
		    	var tmpArr = []
		    	for (var i = 0; i < d.polygon.length; i++) {
		    		tmpArr.push([scaleX(d.polygon[i].x),scaleY(d.polygon[i].y)].join(","));
		    	}
		    	return tmpArr;
		    })
		    .attr("fill", function(d) {
		        return d.color;
		    })
		    .attr("stroke", function(d) {
		        return d.color;
		    })
		    .style("opacity", 0)
		    .style("stroke-width", "1px")
		    .on("click", function(d) {
		    	/*var url = window.location.href;
				url = url.substring(0, url.lastIndexOf("/") + 1);
		    	document.location.href = url + d.project.href;*/
		    	document.location.href = d.project.href;
		    })
		    .on("mouseover", function(d) {
		    	d3.select(this).style("cursor", "pointer");
		    	d3.select(this).transition()
	                .duration(500)
	                .style("stroke","#f0faf0")
	                .style("fill","#f0faf0");

	            var svgPos = $(".svgGlobal")[0].getBoundingClientRect();
	            toolTip.transition()
	                .duration(500)
	                .style("opacity", .8);
	            toolTip.html(d.project.tooltip)
	            	.style("color","#f0faf0")
	                .style("left", (svgPos.x+d.x) + "px")
	                .style("top", (svgPos.y+d.y - 32) + "px");
            })
            .on("mouseout", function(d) {
	            d3.select(this).style("cursor", "default");
	            d3.select(this).transition()
	                .duration(500)
	                .style("stroke",d.color)
	                .style("fill", d.color);
	            toolTip.transition()
	                .duration(500)
	                .style("opacity", 0);
	        });
		tmpForce.nodes(that.pointData)
		    .on("tick", that.tick);
		tmpForce.force("link")
      			.links(linksP);
		return tmpForce;
	}
	changeData(groups){
		/*
			Bekommt die Benötigten neuen Daten, löscht die alten und erstellt
			daraus die neue Visualisierung.
		*/
		svgGlobal.selectAll(".tooltip").remove();
	    svgGlobal.selectAll(".nodeGroup").remove();
	    svgGlobal.selectAll(".links").remove()
	    this.groups = groups;
	    this.groupSectors = this.createGroupSectors();
		this.pointData = this.createPointData();
		this.force = this.createForceSimulation();
	}
	fadeOut(animationTime){
		/*
			Blendet den graph in animationTime ms aus.
		*/
	 	svgGlobal.selectAll(".background").transition()
	 		.duration(animationTime)
	 		.style("opacity", 0);
	 	svgGlobal.selectAll(".links line").transition()
	 		.duration(animationTime)
	 		.style("opacity", 0);
	 	svgGlobal.selectAll(".nodeGroup polygon").transition()
	 		.duration(animationTime)
	 		.style("opacity", 0);
	}
	fadeIn(animationTime){
		/*
			Blendet den graph in animationTime ms ein.
		*/
		svgGlobal.selectAll(".nodeGroup polygon").transition()
	 		.duration(animationTime/2)
	 		.style("opacity", 1);
	 	svgGlobal.selectAll(".background").transition()
	 		.duration(animationTime/2)
	 		.style("opacity", 0.04);
	 	setTimeout(function() {
	 		svgGlobal.selectAll(".links line").transition()
	 			.duration(animationTime/2)
	 			.style("opacity", 1);
		}, animationTime/2);


	}
	createGroupSectors(){
		/*
			Berechnet welche porjekte in Welche sektoren gehören und gibt dies zurück.
		*/
		var circleMiddle = {x:svgGlobal.attr("width")/2,y:svgGlobal.attr("height")/2};
		var outerRadius= 200;
		var innerRadius = 90;

		var tmpGroupSectors = [];//startAngle,endAngle,point,outerRadius,circleMiddle
		for (var i = 0; i < this.groups.length; i++) {
			var tmpEndAngle = this.groups[i].percentageSum*(2*Math.PI);
			var tmpStartAngle = (this.groups[i].percentageSum-this.groups[i].percentage)*(2*Math.PI);
			var tmpFlowAngle = (tmpEndAngle-((tmpEndAngle-tmpStartAngle)/2))+(Math.PI);
			tmpGroupSectors.push({
				startAngle: 	tmpStartAngle,
				endAngle: 		tmpEndAngle,
				flowPoint:{
					x:circleMiddle.x+innerRadius*Math.cos(tmpFlowAngle),
					y:circleMiddle.y+innerRadius*Math.sin(tmpFlowAngle)
				},
				outerRadius: 	outerRadius,
				circleMiddle: 	circleMiddle
			});

		}
		return tmpGroupSectors
	}
	createPointData(){
		/*
			Erstellt Polygon für jedes Projekt (achteck) und fasst die Datenzusammen.

			(schlecht benannt)
			(datenstruktur überarbeiten)
		*/
		var pointData = [];
		var scale = 3.5;
		var poly = [{"x":-3*scale, "y":-1*scale},
		        {"x":-3*scale,"y":1*scale},
		        {"x":-1*scale,"y":3*scale},
		        {"x":1*scale,"y":3*scale},
		        {"x":3*scale,"y":1*scale},
		        {"x":3*scale,"y":-1*scale},
		        {"x":1*scale,"y":-3*scale},
		        {"x":-1*scale,"y":-3*scale}];
		for (var i = 0; i < this.groups.length; i++) {
			for (var j = 0; j < this.groups[i].projects.length; j++) {
				var point = {};
		    	point.color = this.groups[i].color;
		    	point.groupNum = i;
		    	point.project = this.groups[i].projects[j];
		    	point.sector = this.groupSectors[i];
		    	point.time = 0;
		    	point.timeOutside = 0;
		    	point.polygon = poly;
		    	pointData.push(point);
			}
		}
		return pointData;
	}
	tick(that) {
		/*
			Berechnet für die force simulation die bewegung jedes Projektes.

			Am Anfang, während die Projekte noch ausgeblendet sind werden sie Stark zu ihrem richtigen
			Sektor gezogen. Danach bewegen sie sich immer schwächer.
		*/
		svgGlobal.selectAll(".links line").attr("x1", function(d) { return d.source.x; })
        							 .attr("y1", function(d) { return d.source.y; })
        							 .attr("x2", function(d) { return d.target.x; })
        							 .attr("y2", function(d) { return d.target.y; });

        svgGlobal.selectAll('.node').attr("cx", function(d) {
    			if(!isInSector(d.sector.startAngle+ Math.radians(6),
    					d.sector.endAngle - Math.radians(6),
    					d.sector.outerRadius,
    					d.sector.circleMiddle,
    					d)){
    				d.timeOutside++;
    				d.vx += (d.sector.flowPoint.x-d.x)/(7+(100000*((d.time*d.time)/100000000))-(400000*((d.timeOutside
    					*d.timeOutside)/400000000))) ;
				}
				d.time++;
				if(d.time>10000){
					d.time=10000;
				}

				if(d.timeOutside>10000){
					d.timeOutside=10000;
				}
                return d.x;
            })
            .attr("cy", function(d) {
				if(!isInSector(d.sector.startAngle,
    					d.sector.endAngle,
    					d.sector.outerRadius,
    					d.sector.circleMiddle,
    					d)){
					d.vy += (d.sector.flowPoint.y-d.y)/(3+(100000*((d.time*d.time)/100000000))-(400000*((d.timeOutside
    					*d.timeOutside)/400000000))) ;
				}
				d.time++;
				if(d.time>10000){
					d.time=10000;
				}
                return d.y;
            });

        //set polygon xy to circle xy
        svgGlobal.selectAll('.nodeGroup polygon').attr("points",function(d) {
        	var tmpArr = []
        	var nodeX = d3.select(this.parentNode).selectAll("circle").attr("cx");
        	var nodeY = d3.select(this.parentNode).selectAll("circle").attr("cy");
	    	for (var i = 0; i < d.polygon.length; i++) {
	    		tmpArr.push([d.polygon[i].x+Number(nodeX)
	    			,d.polygon[i].y+Number(nodeY)].join(","));
	    	}
	    	return tmpArr;
        });
    }

}
