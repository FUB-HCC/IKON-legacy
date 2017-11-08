
class ProjectGraph{
	constructor() {
		//groups [{text:"",percentage:0,percentageSum:0,color:"",projects:[]},...]
		this.groups = null;
		//groupSectors [{startAngle:0,endAngle:0,flowPoint:{},outerRadius:0,circleMiddle:{}},...]
		this.groupSectors = null;
		//poiintData [{color:"", groupNum: 0, project:{},sector:{}},...]
		this.pointData = null;
		this.force = null;
	}
	createForceSimulation(){
		//also creates the nodes
		var that = this;
		var tmpForce = d3.forceSimulation()
		    .force("collide", d3.forceCollide(19))
		    .force("center", d3.forceCenter(svgGlobal.attr("width") / 2, svgGlobal.attr("height") / 2))
		    .nodes(that.pointData)
		    .on("tick", that.tick);

		svgGlobal.selectAll(".node")
		    .data(that.pointData).enter()
		    .append("circle")
		    .attr("class", "node")
		    .attr("r", 10)
		    .attr("fill", function(d) {
		        return d.color;
		    })
		    .style("stroke", "")
		    .style("opacity", 0)
		    .style("stroke-width", "1px");
		return tmpForce;
	}
	changeData(groups){
	    svgGlobal.selectAll(".node").remove();
	    this.groups = groups;
	    this.groupSectors = this.createGroupSectors();
		this.pointData = this.createPointData();
		this.force = this.createForceSimulation();//TODO
	}
	fadeOut(animationTime){
		svgGlobal.selectAll(".node").transition()
	 		.duration(animationTime)
	 		.style("opacity", 0);
	}
	fadeIn(animationTime){
		svgGlobal.selectAll(".node").transition()
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
		for (var i = 0; i < this.groups.length; i++) {
			for (var j = 0; j < this.groups[i].projects.length; j++) {
				var point = {};
		    	point.color = this.groups[i].color;
		    	point.groupNum = i;
		    	point.project = this.groups[i].projects[j];
		    	point.sector = this.groupSectors[i];
		    	point.time = 0;
		    	point.timeOutside = 0;
		    	pointData.push(point);
			}
		}
		return pointData;
	}
	tick() {
		/* Called on every tick in the force simulation. */
        svgGlobal.selectAll('.node').attr("cx", function(d) {
    			if(!isInSector(d.sector.startAngle+ Math.radians(6),
    					d.sector.endAngle - Math.radians(6),
    					d.sector.outerRadius,
    					d.sector.circleMiddle,
    					d)){
    				d.timeOutside++;
    				d.vx += (d.sector.flowPoint.x-d.x)/(10+(100000*((d.time*d.time)/100000000))-(100000*((d.timeOutside
    					*d.timeOutside)/100000000))) ;
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
					d.vy += (d.sector.flowPoint.y-d.y)/(15+(1000*((d.time*d.time)/10000000))) ;
				}
				d.time++;
				if(d.time>10000){
					d.time=10000;
				}
                return d.y;
            })
    }

}
