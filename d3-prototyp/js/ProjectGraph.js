
class ProjectGraph{
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
		//also creates the nodes
		var that = this;
		var scaleX = d3.scaleLinear()
		        .domain([-30,30])
		        .range([0,600]);
		var scaleY = d3.scaleLinear()
		        .domain([0,50])
		        .range([500,0]);
		var tmpForce = d3.forceSimulation()
		    .force("collide", d3.forceCollide(19))
		    .force("center", d3.forceCenter(svgGlobal.attr("width") / 2, svgGlobal.attr("height") / 2))
		    .nodes(that.pointData)
		    .on("tick", that.tick);

		var toolTip = d3.select("body").append("div")
    		.attr("class", "tooltip")
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
		    	document.location.href = d.project.href;
		    })
		    .on("mouseover", function(d) {
		    	d3.select(this).transition()
	                .duration(500)
	                .style("stroke","#fff")
	                .style("fill","#fff");

	            var svgPos = $(".svgGlobal")[0].getBoundingClientRect();
	            toolTip.transition()
	                .duration(500)
	                .style("opacity", .8);
	            toolTip.html(d.project.tooltip)
	                .style("left", (svgPos.x+d.x) + "px")
	                .style("top", (svgPos.y+d.y - 32) + "px");
            })
            .on("mouseout", function(d) {
	            d3.select(this).transition()
	                .duration(500)
	                .style("stroke",d.color)
	                .style("fill", d.color);
	            toolTip.transition()
	                .duration(500)
	                .style("opacity", 0);
	        });
		return tmpForce;
	}
	changeData(groups){
		svgGlobal.selectAll(".tooltip").remove();
	    svgGlobal.selectAll(".nodeGroup").remove();
	    this.groups = groups;
	    this.groupSectors = this.createGroupSectors();
		this.pointData = this.createPointData();
		this.force = this.createForceSimulation();
	}
	fadeOut(animationTime){
		svgGlobal.selectAll(".nodeGroup .node").transition()
	 		.duration(animationTime)
	 		.style("opacity", 0);
	 	svgGlobal.selectAll(".nodeGroup polygon").transition()
	 		.duration(animationTime)
	 		.style("opacity", 0);
	}
	fadeIn(animationTime){
		svgGlobal.selectAll(".nodeGroup .node").transition()
	 		.duration(animationTime)
	 		.style("opacity", 0.15);
		svgGlobal.selectAll(".nodeGroup polygon").transition()
	 		.duration(animationTime)
	 		.style("opacity", 1);

	}
	createGroupSectors(){
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
	tick() {
		/* Remove Circles ? Was first used instead of polygons and contains the x y computation.
			Possible dependency with Force simulation.*/
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
