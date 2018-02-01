
class TimeLine{
	/*
		Displays an object for each entry representing its duration.

		//TODO tooltip, Href
	*/
	constructor(svgId, data, type, config = {}) {
		/*
			Public
			Creates all nessecary data and shows the Visulisation
				svgId - defines the SVG Id (e.g."#svgChart") where the Visulisation should be appended
				data  - the newProjects.json set or a subset of it
				type  - String defining the Visualisation Type
				config- Json with variables defining the Style properties
		*/

		/*
			visdata  - Is an array where each entry represents an Object in the Chart. To seperate e.g.
						the FBs, there are 4 empty entries between them.

						num is used to put two or more objects in the same row to Optimize space
						[{num:,color:,startDate:, endDate:,projectId:},...]
		*/
		this.visData = this._processData(data);
		this.transitionTime = 1000;
		this.delayTime = 500
		this.tooltipTransitionTime = 200;

		this.svg = d3.select(svgId);
		this.width = this.svg.attr("width");
		this.height = this.svg.attr("height");
		this.g = this.svg.append("g")
					.attr("transform","translate("  + (this.width/4) + ","
													+ (this.height/4) + ")");
		this.xScale = d3.scaleBand()
						.range([0, this.width/2])
						.padding(0.1);
		this.yScale = d3.scaleTime()
						.range([this.height/2, 0]);
		this.rightAxis = this.g.append("g")
							.attr("class", "yTimeLine")

		this.g.append("line").attr("class","currentDay").style("opacity", 0);
		this.g.append("circle").attr("class","rightDot").style("opacity", 0);
		this.g.append("circle").attr("class","leftDot").style("opacity", 0);

		this.tooltip = d3.select("body").append("div")
			.attr("class", "tooltip")
			.style("opacity", 0);

		this._updateD3Elements();
		this._updateSvgElements();

	}
	updateData(data){
		/*
			Public
			Updates The Visulisation with the new Data
				data - the newProjects.json set or a subset of it
		*/
		this.visData = this._processData(data);
		this._updateD3Elements();
        this._updateSvgElements();

	}
	updateType(type){
		/*
			Public
			Changes how the data is displayed (e.g. different Values on the axises)
				type  - String defining the Visualisation Type
		*/
		//possibly a switch case which handles the different Types
	}

	_processData(inData){
		/*
			Private
			Transforms the data in to a format which can be easily used for the Visulisation.

				inData - the newProjects.json set or a subset of it

				Returns the visData.

			(Possibly split up into a different function for each Visualisation type)
		*/
		function optimizeSpace(data, offset){
			/*
				Group Projects into the same Row to minimize the width
				by giving them the same num value.
				(Restricted to 2 Projects per row with at least 1 Month between them )
					data - preprocessed projects data
					offset - int increasing all nums of this dataset
						This is used to avoid overlapping num values between datasets.
			*/
			function endDateSort(a, b) {
				return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
			}
			data.sort(endDateSort);
			for (var i = 0; i < data.length; i++) {

				if(!data[i].foundFit){
					data[i].num = i+offset;
					for (var j = i+1; j < data.length; j++) {
						if( !data[j].foundFit &&  data[i].endDate.getTime()+(31*24*60*60*1000)
												< data[j].startDate.getTime()){
							data[j].num = i + offset;
							data[j].foundFit = true;
							break;
						}
					}
				}
				delete data[i].foundFit;
			}
			return data;
		}
		function shuffleArray(array) {
			for (var i = array.length - 1; i > 0; i--) {
				var j = Math.floor(Math.random() * (i + 1));
				var temp = array[i];
				array[i] = array[j];
				array[j] = temp;
			}
			return array;
		}

		//Stage 1 create baseData and split by FB
		var splitFbs = [[],[],[],[]];
		for (var pId in inData) {
			var d={
				num: 0,
				color: colors.fb[inData[pId].forschungsbereich],
				startDate: inData[pId].start,
				endDate: inData[pId].end,
				projectId: pId,
				foundFit: false //needed to optimize Spacing (later deleted)
			};
			splitFbs[inData[pId].forschungsbereich-1].push(d);

		}

		//Stage 2 Optimize space for each fb and insert spacing between fbs
		var resultData = [];
		var previousNums = 0;
		for (var i = 0; i < splitFbs.length; i++) {
			//concat didnot work :(
			var result = shuffleArray(optimizeSpace(splitFbs[i],previousNums));
			for (var j = 0; j < result.length; j++) {
				resultData.push(result[j]);
			}
			previousNums +=splitFbs[i].length;
			for (var j = 0; j < 5 && i<splitFbs.length-1; j++) {
				resultData.push({num: previousNums, startDate: null, endDate: null,projectId:null});
				previousNums +=1;
			}
		}
		return resultData
	}
	_updateD3Elements(){
		/*
			Private
			Updates all nessecary D3 elements (e.g. ForceSimulation, Scales)
			Uses the globally defined Data in this.visData
		*/
		this.xScale.domain(this.visData.map(function(d) { return d.num; }));
		this.yScale.domain([d3.min(this.visData, function(d) { return d.startDate; }),
							d3.max(this.visData, function(d) { return d.endDate; })]);
	}
	_updateSvgElements(){
		/*
			Private
			Updates all nessecary SVG elements
		*/
		this._updateAxis();
		this._updateCurrentDayIndication();
		this._updateBars();
	}
	_updateAxis(){
		/*
			Updates the axis in the svg
		*/
		this.g.select(".yTimeLine").transition().delay(this.delayTime).duration(this.transitionTime)
                    .call(d3.axisRight(this.yScale)
                    	.tickSize(this.width/2))
                    	.selectAll(".tick text")
                    		.attr("x", this.xScale.range()[1]+20);
	}
	_updateCurrentDayIndication(){
		/*
			Updates the CurrentDayIndication in the svg
		*/
		var d = new Date();

		this.g.select(".currentDay")
				.attr("stroke",colors.system.active)
				.transition().delay(this.delayTime).duration(this.transitionTime)
				.attr("y1", this.yScale(d))
				.attr("y2", this.yScale(d))
				.attr("x1", -5)
				.attr("x2", this.width/2+5)
				.style("opacity", 1);

		this.g.select(".rightDot")
				.style("fill",colors.system.active)
				.transition().delay(this.delayTime).duration(this.transitionTime)
				.attr("r", 4)
				.attr("cx", -5)
				.attr("cy", this.yScale(d))
				.style("opacity", 1);

		this.g.select(".leftDot")
				.style("fill",colors.system.active)
				.transition().delay(this.delayTime).duration(this.transitionTime)
				.attr("r", 4)
				.attr("cx", this.width/2+5)
				.attr("cy", this.yScale(d))
				.style("opacity", 1);
	}
	_updateBars(){
		/*
			Updates all Bars in the svg and a tooltip in the Body
		*/
		/*
			Replace Bars with path or polygon for different Visulisations of the Project
			(possibly seperate Class)
		*/
		var that = this;
		var bars = this.g.selectAll(".bar")
                    	.data(this.visData,function(d){return d.projectId});
        //Delete old elements
        bars.exit().transition()
      			.duration(this.transitionTime)
      			.attr("y",function(d){
      				var tmp = new Date(d.endDate)
      				tmp.setDate(tmp.getDate()-600);
      				return that.yScale(tmp);
      			})
      			.style("opacity",0)
      			.remove();
      	//Add new elements
      	bars.enter().append("rect")
			.attr("class", "bar")
			.attr("stroke",function(d) {
				return d.color;
			})
			.style('fill',function(d) {
				return d.color;
			})
			.style("opacity", 0)
			.attr("x", function(d) { return that.xScale(d.num); })
			.attr("width", this.xScale.bandwidth()-3)
			.attr("y", function(d) { return that.yScale(d.endDate); })
			.attr("height", function(d) { return  that.yScale(d.startDate) - that.yScale(d.endDate);})
			.on("click", function(d) {
				//TODO HREF
				document.location.href = "/hrefIsNotUsed";
			})
			.on("mouseover", function(d) {
				d3.select(this).style("cursor", "pointer");
				d3.select(this).transition()
					.duration(that.tooltipTransitionTime)
					.style("stroke",colors.system.active)
					.style("fill",colors.system.active);
				that.tooltip.transition()
					.duration(that.tooltipTransitionTime)
					.style("opacity", .8);
				//TODO tooltip
				that.tooltip.html("No tooltip")
					.style("color",colors.system.active)
					.style("left", (d3.event.pageX) + "px")
					.style("top", (d3.event.pageY - 32) + "px");
			})
			.on("mouseout", function(d) {
				d3.select(this).style("cursor", "default");
				d3.select(this).transition()
					.duration(that.tooltipTransitionTime)
					.style("stroke",d.color)
					.style("fill",d.color);
				that.tooltip.transition()
					.duration(that.tooltipTransitionTime)
					.style("opacity", 0);
			})
			.transition().delay(this.delayTime).duration(this.transitionTime)
				.style("opacity", 1);
		//Update
      	bars.transition()
      		.delay(this.delayTime)
      		.duration(this.transitionTime)
      		.attr("x", function(d) { return that.xScale(d.num); })
			.attr("width", this.xScale.bandwidth()-3)
			.attr("y", function(d) { return that.yScale(d.endDate); })
			.attr("height", function(d) { return  that.yScale(d.startDate) - that.yScale(d.endDate);});
	}

}
