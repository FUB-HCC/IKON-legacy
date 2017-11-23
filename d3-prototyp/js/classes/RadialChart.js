class RadialChart {
    constructor() {
    	this.sectors = null;//[{text:"",percentage:0,percentageSum:0,color:"",projects:[]},...]
		this.textLabels = null;
		this.arcs = null;
		this.arc = d3.arc().innerRadius(220).outerRadius(240);
		this.g = svgGlobal.append("g").attr("transform", "translate("
						+ svgGlobal.attr("width") / 2 + ","
						+ svgGlobal.attr("height") / 2 + ")");
    }

    changeData(sectors){
		this.sectors = sectors;
		this.arcs = this.createArcs();
		this.textLabels = this.createLabels();

    }
    createArcs(){
    	var that= this;
    	var tmpArcs = []
		for (var i = 0; i < this.sectors.length; i++) {
	   		var part = this.g.append("path")
			    .datum({endAngle: -(2 * Math.PI)/4})
			    .style("fill",function(){
			    	return that.sectors[that.sectors.length-1-i].color;
			    });
		    tmpArcs.push(part);
	    }
	    return tmpArcs;
    }
    createLabels(){
    	//Override Old Labels
	    if(this.textLabels!=null){
	    	this.textLabels.remove();
	    }

	    //create New Labels
	    /*var tmpTextLabels=svgGlobal.selectAll()
            .data(this.sectors)
            .enter()
            .append("text")
            .attr('class','legend')
            .attr("transform", function (d) {
            	var angle = ( ( d.percentageSum - (d.percentage/2) ) * (2*Math.PI))
            				- ((2*Math.PI)/4);
                return "translate("+((svgGlobal.attr("width")/2)+(330 * Math.sin(angle)))+","
                		+((svgGlobal.attr("height")/2)-(310 * Math.cos(angle)))+")";
                /* ADDING this rotates the text to the middle
                + "rotate("+(((angle* 180) / Math.PI))+")"
            })
            .attr("dy", ".4em")
            .attr("text-anchor", "middle")
            .text(function(d){
                return d.text;
            })
            .style("fill",function(d){
            	return d.color;
            })
            .style("opacity",0);
    	return tmpTextLabels;*/
    }

    fadeIn(animationTime){
    	//! Animationtime is only for the arcs afterwards the text fades in! TODO
    	var that = this;
	 	for (var i = 0; i < this.arcs.length; i++) {
	 		this.arcs[this.arcs.length-1-i].transition()
	      		.duration(animationTime)
	      		.attrTween("d", that.arcTween(((that.sectors[i].percentageSum)*(2*Math.PI))
	      						-((2*Math.PI)/4),((that.sectors[i].percentageSum-that.sectors[i].percentage)*(2*Math.PI))
	      						-((2*Math.PI)/4)));
	 	}
		/*setTimeout(function() {
    		that.textLabels.transition()
		 		.duration(animationTime)
		 		.style("opacity", 1);
		}, animationTime/1.5);*/
    }
    fadeOut(animationTime){
	 	var that = this;
	 	for (var i = 0; i < this.arcs.length; i++) {
	 		this.arcs[i].transition()
	      		.duration(animationTime)
	      		.attrTween("d", that.arcTween(-((2*Math.PI))/4,-((2*Math.PI))/4));
	 	}
 		/*this.textLabels.transition()
	 		.duration(animationTime)
	 		.style("opacity", 0);*/
    }
    arcTween(newEndAngle,newStartAngle) {
    	var that = this;
		return function(d) {
			var interpolateEnd = d3.interpolate(d.endAngle, newEndAngle);
			var interpolateStart = d3.interpolate(-(2 * Math.PI)/4, newStartAngle);
			return function(t) {
				d.endAngle = interpolateEnd(t);
				d.startAngle = interpolateStart(t);
				return that.arc(d);
			};
		};
	}
}
