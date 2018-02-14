class ProjectGraph{
	/*
		Description
		TODO:
			Update Forcesimulation/Scales
			Check Forcesimulation,Scale,Tick, innerouter Radius, circleMiddle, flowPoint, Circle

			ADD Links
			Correct updateData

			Tooltip not disapearing und update
	*/

	constructor(svgId, data, type = "forschungsbereiche", config = {}) {
		/*
			Public
			updates all nessecary data and shows the Visulisation
				svgId - defines the SVG Id (e.g."#svgChart") where the Visulisation should be appended
				data  - the newProjects.json set or a subset of it
				type  - String defining the Visualisation Type
				config- Json with variables defining the Style properties
		*/
		this.colors = colors;
		this.flowPointRadius = 90;
		this.outerRadius = 200;
		this.animationTime = 1500;
		this.delayTime = 0;
		this.type = type;
		this.data = data;

		this.svg = d3.select(svgId);
		this.width = this.svg.attr("width");
		this.height = this.svg.attr("height");
		this.circleMiddle = {x:this.width/2,y:this.height/2};
		this.g = this.svg.append("g")
					.attr("transform","translate("  + (this.width/2) + ","
													+ (this.height/2) + ")");
		this.svg.append("circle")
				.attr("class","background")
   				.style("fill",this.colors.system.active)
		  		.style("opacity",0.04)
		  		.attr("r", 220)
		  		.attr("cx", svgGlobal.attr("width") / 2)
		  		.attr("cy", svgGlobal.attr("height") / 2);

		this.scaleX = d3.scaleLinear()
		        .domain([-30,30])
		        .range([0,600]);
		this.scaleY = d3.scaleLinear()
		        .domain([0,50])
		        .range([500,0]);
		this.force = d3.forceSimulation()
			//.force("link", d3.forceLink().id(function(d) { return d.project.id; }))
		    //.force("charge", d3.forceManyBody().strength(-10))
		    .force("collide", d3.forceCollide(19))//ForceStrength?
		    .force("center", d3.forceCenter( this.width/2, this.height/2 ))
		    .alphaTarget(1);
		this.tooltip = d3.select("body").append("div")
    		.attr("class", "tooltip")
    		.style("opacity", 0);

		var scale = 3.5;
		this.polygon = [{"x":-3*scale, "y":-1*scale},{"x":-3*scale,"y":1*scale},{"x":-1*scale,"y":3*scale},
						{"x":1*scale,"y":3*scale},{"x":3*scale,"y":1*scale},{"x":3*scale,"y":-1*scale},
		        		{"x":1*scale,"y":-3*scale},{"x":-1*scale,"y":-3*scale}];

		this.visData = this._processData(data,type);
		var that = this;
		this._updateD3Functions();
		this._updateSvgElements();
		this.force.nodes(this.visData)
		    .on("tick", this._tick(this))
		/*tmpForce.force("link")
      			.links(linksP);*/

	}
	updateData(data){
		/*
			Public
			Updates The Visulisation with the new Data
				data - the newProjects.json set or a subset of it
		*/
		this.visData = this._processData(data,this.type);
		this._updateD3Functions();
        this._updateSvgElements();
        this.outerRadius = 200;
        var area = this.outerRadius*this.outerRadius*Math.PI;
        var areaPerElem = (area/this.visData.length)*(80/100);
        var radius = Math.sqrt(areaPerElem/Math.PI);
		var scale = radius/5;
		this.outerRadius = this.outerRadius - radius*(3/5);
		this.polygon = [{"x":-3*scale, "y":-1*scale},{"x":-3*scale,"y":1*scale},{"x":-1*scale,"y":3*scale},
						{"x":1*scale,"y":3*scale},{"x":3*scale,"y":1*scale},{"x":3*scale,"y":-1*scale},
		        		{"x":1*scale,"y":-3*scale},{"x":-1*scale,"y":-3*scale}];
        this.force.force("collide", d3.forceCollide(radius)).nodes(this.visData);
	}
	updateType(type){
		/*
			Public
			Changes how the data is displayed (e.g. different Values on the axises)
				type  - String defining the Visualisation Type
		*/
		this.visData = this._processData(this.data,type);
		this._updateD3Functions();
        this._updateSvgElements();
	}

	_processData(data,type){
		/*
			Private
			Transforms the data in to a format which can be easily used for the Visulisation.
				inData - the newProjects.json set or a subset of it

				Returns the processed data.

		*/
		var result = null;
		switch(type) {
			case "forschungsbereiche":
				result = this._processFbs(data, type);
				break;
			case "kooperationspartner":
				//TODO
				break;
			default:
				console.log("ForceGraph Error: Unkown type");
		}
		return result;
	}
	_processFbs(data,type){
		/*
		*/
		var fbPercent = [0,0,0,0];
		var projectCount = 0;
		var pId;
		for (pId in data) {
			fbPercent[data[pId].forschungsbereich - 1]++;
			projectCount++;
		}
		for(var i = 0; i < fbPercent.length; i++){
			fbPercent[i] = fbPercent[i]/projectCount;
		}
		var sectors = this._processSectors(fbPercent);

		var pointData = [];
		for(pId in data){
			var fb = data[pId].forschungsbereich-1;
			var point = {
				color: this.colors.fb[fb+1],
				project: data[pId],
				sector: sectors[fb]
			}
			pointData.push(point);
		}
		return pointData;
	}
	_processSectors(sectorPercentages){
		/*
			Calculates the Sectors in which each Project should be
			{startAngle: 0, endAngle: 2.426180465148553, flowPoint: {x:,y:}}

				sectorPercentages - [0.2,0.3,0.5] sum of percentages has to be 1

		*/

		var sectors = [];
		var angleSum = -(2*Math.PI)/4
		for (var i = 0; i < sectorPercentages.length; i++) {

			var startAngle = angleSum;
			angleSum += (2*Math.PI)*sectorPercentages[i];
			var endAngle = angleSum;

			var sectorWidth = endAngle-startAngle;
			var flowPointAngle = (startAngle+sectorWidth/2);
			sectors.push({
				startAngle: 	startAngle,
				endAngle: 		endAngle,
				flowPoint:{
					x:this.circleMiddle.x+this.flowPointRadius*Math.sin(flowPointAngle),
					y:this.circleMiddle.y-this.flowPointRadius*Math.cos(flowPointAngle)
				}
			});

		}
		return sectors
	}
	_updateD3Functions(){
		/*
			Private
			Updates all nessecary D3 funcitons (e.g. ForceSimulation, Scales)
		*/
	}
	_updateSvgElements(){
		/*
			Private
			Updates all nessecary SVG elements
		*/
		this._updateNodes();
		this._updateLinks();
	}
	_updateNodes(){
		var that = this;
		var nodes = this.svg.selectAll(".nodes")
		    .data(this.visData,function(d){ return Math.random(); });

		nodes.exit()
				.style("opacity", 0)
          		.remove();
		nodes.enter()
		    	.append("g")
		    	.attr("class","nodes")
				.append("polygon")
			    .attr("fill", function(d) {
			        return d.color;
			    })
			    .attr("stroke", function(d) {
			        return d.color;
			    })
			    .style("opacity", 1)
			    .style("stroke-width", "1px")
			    .on("click", function(d) {
			    	//TODO href
			    	document.location.href = d.project.href;
			    })
			    .on("mouseover", function(d) {
			    	d3.select(this).style("cursor", "pointer");
			    	d3.select(this).transition()
		                .duration(500)
		                .style("stroke",that.colors.system.active)
		                .style("fill",that.colors.system.active);
		            var svgPos = $(".svgGlobal")[0].getBoundingClientRect();
		            that.tooltip.transition()
		                .duration(500)
		                .style("opacity", .8);
		            that.tooltip.html(d.project.id)
		            	.style("color",that.colors.system.active)
		                .style("left", (svgPos.x+d.x) + "px")
		                .style("top", (svgPos.y+d.y - 32) + "px");
	            })
	            .on("mouseout", function(d) {
		            d3.select(this).style("cursor", "default");
		            d3.select(this).transition()
		                .duration(500)
		                .style("stroke",d.color)
		                .style("fill", d.color);
		            that.tooltip.transition()
		                .duration(500)
		                .style("opacity", 0);
		        });
	}
	_updateLinks(){
		//TODO Later
	}
	_tick(that) {
		return function(){
			/*
				Berechnet für die force simulation die bewegung jedes Projektes.

				Am Anfang, während die Projekte noch ausgeblendet sind werden sie Stark zu ihrem richtigen
				Sektor gezogen. Danach bewegen sie sich immer schwächer.
			*/
			/*this.svg.selectAll(".links line").attr("x1", function(d) { return d.source.x; })
	        							 .attr("y1", function(d) { return d.source.y; })
	        							 .attr("x2", function(d) { return d.target.x; })
	        							 .attr("y2", function(d) { return d.target.y; });*/

	        that.svg.selectAll(".nodes polygon")
	        .attr("text",function(d) {
	        	return d.x+" "+d.y;
	        })
	        .attr("points",function(d) {
	        	if(!that._isInSector(d.sector.startAngle,
	    					d.sector.endAngle,
	    					that.outerRadius,
	    					that.circleMiddle,
	    					d)){
    				d.vy += (d.sector.flowPoint.y-d.y)/10;
    				d.vx += (d.sector.flowPoint.x-d.x)/10;
				}
                var nodeX = d.x;
                var nodeY = d.y;
	        	var tmpArr = [];
		    	for (var i = 0; i < that.polygon.length; i++) {
		    		tmpArr.push([that.polygon[i].x+Number(nodeX)
		    			,that.polygon[i].y+Number(nodeY)].join(","));
		    	}
		    	return tmpArr;
	        });
	    }
    }

    /*
    	Only for this._isInSector which is only used in this._tick
    */
    _vecMinus(v1,v2){
		return {x:(v1.x-v2.x),y:(v1.y-v2.y)};
	}
	_distance(p1,p2){
		return Math.sqrt(Math.pow(p1.x-p2.x,2)+Math.pow(p1.y-p2.y,2));
	}

	_radBetweenVectors(v1,v2){
		var dot = v1.x*v2.x + v1.y*v2.y;
		var det = v1.x*v2.y - v1.y*v2.x;
		var angle = Math.atan2(det, dot);// -180, 180
		angle = -angle;
		if(angle < 0){
			angle = (angle+Math.PI*2)%(Math.PI*2);
		}

		return angle;
	}
	_isInSector(startAngleRad,endAngleRad, radius, middle, point){
		var angle = this._radBetweenVectors(this._vecMinus(point,middle),{x:-1,y:0});
		var dist = this._distance(middle,point);
		//+(Math.PI*2)/4 weil es bei uns links anfängt
		if(startAngleRad+(Math.PI*2)/4 < angle && angle < endAngleRad+(Math.PI*2)/4 && dist <= radius){
			return true;
		}else{
			return false;
		}
	}


}