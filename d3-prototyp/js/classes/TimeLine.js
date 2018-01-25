
class TimeLine{
	/*
		Displays an object for each entry representing its duration.

		//TODO ToolTip, Href and FadeIn/Out?
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

		this.svg = d3.select(svgId);
		this.width = this.svg.attr("width");
		this.height = this.svg.attr("height");
		this.container = this.svg.append("g")
					.attr("transform","translate("  + (this.width/4) + ","
													+ (this.height/4) + ")");
		this.xScale = d3.scaleBand()
						.range([0, this.width/2])
						.padding(0.1);
		this.yScale = d3.scaleTime()
						.range([this.height/2, 0]);
		this.inData = data;
		/*
			visdata  - Is an array where each entry represents an Object in the Chart. To seperate e.g.
						the FBs, there are 4 empty entries between them.

						num is used to put two or more objects in the same row to Optimize space
						[{num:,color:,startDate:, endDate:,projectId:},...]
		*/
		this.visData = [];
		this._createData();
		this._createD3Elements();
		this._createSvgElements();

	}
	updateData(data){
		/*
			Public
			Updates The Visulisation with the new Data
				data - the newProjects.json set or a subset of it
		*/
	}
	updateType(type){
		/*
			Public
			Changes how the data is displayed (e.g. different Values on the axises)
				type  - String defining the Visualisation Type
		*/
		//possibly a switch case which handles the different Types
	}

	_createData(){
		/*
			Private
			Transforms the data in to a format which can be easily used for the Visulisation.

			(Possibly split up into a different function for each Visualisation type)
		*/
		function optimizeSpace(data, offset){
			/*
				This is only an approximation. I could only think of Brutforce for optimal spacing
				Additionally it is visually more appealling to have 4 rows with 2 projects instead
				of one row with 5.
				This is why I restricted each row to only have 2 projects and guaranteed that there
				is a gap of at least 2 weeks between them.

					offset - int increasing all nums by its value
						This is used to avoid overlapping num values between each fb dataset.
						If they are the same they will get displayed in the same row.
			*/
			function endDateSort(a, b) {
				return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
			}
			data.sort(endDateSort);
			for (var i = 0; i < data.length; i++) {
				if(!data[i].foundFit){
					data[i].num = i+offset;
					for (var j = i+1; j < data.length; j++) {
						if( !data[j].foundFit &&  data[i].endDate.getTime()+(14*24*60*60*1000)
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
		for (var pId in this.inData) {
			var d={
				num: 0,
				color: colors.fb[this.inData[pId].forschungsbereich],
				startDate: this.inData[pId].start,
				endDate: this.inData[pId].end,
				projectId: pId,
				foundFit: false //needed to optimize Spacing (later deleted)
			};
			splitFbs[this.inData[pId].forschungsbereich-1].push(d);

		}

		//Stage 2 Optimize space for each fb and insert spacing between fbs

		this.visData = [];
		var previousNums = 0;
		for (var i = 0; i < splitFbs.length; i++) {
			//concat didnot work :(
			var result = shuffleArray(optimizeSpace(splitFbs[i],previousNums));
			for (var j = 0; j < result.length; j++) {
				this.visData.push(result[j]);
			}
			previousNums +=splitFbs[i].length;
			for (var j = 0; j < 5; j++) {
				this.visData.push({num: previousNums, startDate: null, endDate: null,projectId:null});
				previousNums +=1;
			}
		}
	}
	_createD3Elements(){
		/*
			Private
			Creates all nessecary D3 elements (e.g. ForceSimulation, Scales)

				After 	_createData()
				Before 	_createSvgElements()
		*/
		this.xScale.domain(this.visData.map(function(d) { return d.num; }));
		this.yScale.domain([d3.min(this.visData, function(d) { return d.startDate; }),
							d3.max(this.visData, function(d) { return d.endDate; })]);
	}
	_createSvgElements(){
		/*
			Private
			Creates all nessecary SVG elements
		*/
		this._createAxis();
		this._createCurrentDayIndication();
		this._createBars();
	}
	_createAxis(){
		/*
			Creates the axis in the svg
		*/

		var g = this.container.append("g")
			.attr("class", "timeLine")
			.call(d3.axisRight(this.yScale).tickSize(this.width/2));
		g.select(".domain").remove();
		g.selectAll(".tick line").attr("stroke", "#88a").attr("stroke-dasharray", "2,2");
		g.selectAll(".tick text").attr("x", Number(g.select(".tick text").attr("x"))+20);
	}
	_createCurrentDayIndication(){
		/*
			Creates the CurrentDayIndication in the svg
		*/
		var d = new Date();

		this.container.append("line")
				.attr("stroke",colors.system.active)
				.attr("y1", this.yScale(d))
				.attr("y2", this.yScale(d))
				.attr("x1", -5)
				.attr("x2", this.width/2+5);

		this.container.append('circle')
				.style("fill",colors.system.active)
				.attr("r", 4)
				.attr('cx', -5)
				.attr('cy', this.yScale(d))

		this.container.append('circle')
				.style("fill",colors.system.active)
				.attr("r", 4)
				.attr('cx', this.width/2+5)
				.attr('cy', this.yScale(d))
	}
	_createBars(){
		/*
			Creates all Bars in the svg and a tooltip in the Body
		*/
		var toolTip = d3.select("body").append("div")
			.attr("class", "tooltip")
			.style("opacity", 0);

		var that = this;
		/*
			Replace Bars with path or polygon for different Visulisations of the Project
			(possibly seperate Class)
		*/
		this.container.selectAll(".bar")
			.data(this.visData)
			.enter().append("rect")
			.attr("class", "bar")
			.attr("stroke",function(d) {
				return d.color;
			})
			.style('fill',function(d) {
				return d.color;
			})
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
					.duration(500)
					.style("stroke",colors.system.active)
					.style("fill",colors.system.active);

				var svgPos = $(".svgGlobal")[0].getBoundingClientRect();
				toolTip.transition()
					.duration(500)
					.style("opacity", .8);
				//TODO ToolTip
				toolTip.html("No toolTip")
					.style("color",colors.system.active)
					.style("left", (d3.event.pageX) + "px")
					.style("top", (d3.event.pageY - 32) + "px");
			})
			.on("mouseout", function(d) {
				d3.select(this).style("cursor", "default");
				d3.select(this).transition()
					.duration(500)
					.style("stroke",d.color)
					.style("fill",d.color);
				toolTip.transition()
					.duration(500)
					.style("opacity", 0);
			});
	}

}
