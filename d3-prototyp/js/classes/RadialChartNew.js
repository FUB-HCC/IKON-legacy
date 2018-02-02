class RadialChartNew{
	/*
		Description
	*/

	constructor(svgId, data, type = "forschungsbereiche", config = {}) {
		/*
			Public
			updates all nessecary data and shows the Visulisation
				svgId - defines the SVG Id (e.g."#svgChart") where the Visulisation should be appended
				data  - the newProjects.json set or a subset of it
				type  - String defining the Visualisation Type
							In this case mainly defining how the Data is Sorted
				config- Json with variables defining the Style properties
		*/
		this.colors = colors;
		this.innerRadius = 220;
		this.outerRadius = 240;
		this.animationTime = 1000;
		//Delays the Text fade in maybe changeName for consistency
		this.delayTime = 500;
		this.type = type;
		this.data = data;
		/*
			[{text:,startAngle:, endAngle:,color:},...]
			Each json in this Array defines a part of the Circle.
		*/
		this.visData = this._processData(data,type);

		this.svg = d3.select(svgId);
		this.width = this.svg.attr("width");
		this.height = this.svg.attr("height");
		this.g = this.svg.append("g")
					.attr("transform","translate("  + (this.width/2) + ","
													+ (this.height/2) + ")");

		this.arc = d3.arc().innerRadius(this.innerRadius).outerRadius(this.outerRadius);

		this._updateD3Functions();
		this._updateSvgElements();


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

	_processData(data, type){
		/*
			Private
			Transforms the data in to a format which can be easily used for the Visulisation.
				inData - the newProjects.json set or a subset of it
				type - the value which should be sorted

				Returns the processed data.

		*/
		//Possibly split up into a different functions for each Visualisation type
		var result = null;
		switch(type) {
			case "forschungsbereiche":
				result = this._processFbs(data, type);
				break;
			case "kooperationspartner":
				//TODO
				break;
			default:
				console.log("RadialChart Error: Unkown type");
		}
		return result;
	}
	_processFbs(data, type){
		var splitFbs =[];
		for (var i = 0; i < 4; i++) {
			splitFbs.push({
				text: 			"Forschungsbereich " + (i+1),
				startAngle: 	0,
				endAngle: 		0,
				color: 			this.colors.fb[(i+1)],
				count: 			0 		//Temporary to determine Angles
			});
		}

		//Count Number of Projects
		var projectCount = 0;
		for (pId in data) {
			splitFbs[data[pId].forschungsbereich - 1].count++;
			projectCount++;
		}

		var angleSum = -(2 * Math.PI)/4;
		for (var i = 0; i < splitFbs.length; i++) {
			splitFbs[i].startAngle = angleSum;
			angleSum += ((splitFbs[i].count/projectCount)*(2 * Math.PI));
			splitFbs[i].endAngle = angleSum;
			delete splitFbs[i].count;
		}
		return splitFbs;
	}
	_updateD3Functions(){
		/*
			Private
			Updates all nessecary D3 funcitons
		*/
		this.arc = d3.arc().innerRadius(this.innerRadius).outerRadius(this.outerRadius);
	}
	_updateSvgElements(){
		/*
			Private
			Updates all nessecary SVG elements
		*/
		this._updateArcs();
		this._updateLabels();
	}
	_updateArcs(){
		//TODO
		var that = this;
		var arcs = this.g.selectAll(".arcs")
				.data(this.visData,function(d){ return d.text; });
		//arcs.exit()
		arcs.enter().append("path")
				.attr("class", "arcs")
				/*.datum({endAngle: -(2 * Math.PI)/4}) TODO*/
				.style("fill",function(d){ return d.color; })
				.transition()
				.duration(this.animationTime)
				.attrTween("d",function(d){
					var interpolateStartAngle = d3.interpolate(-(2 * Math.PI)/4, d.startAngle);
					var interpolateEndAngle = d3.interpolate(-(2 * Math.PI)/4, d.endAngle);
					console.log(d)
					return function(t) {
						d.startAngle = interpolateStartAngle(t);
						d.endAngle = interpolateEndAngle(t);
						return that.arc(d);
					};
				});

		//For Update
		//arcs.transition()
	}
	_updateLabels(){
		var that = this;
		var labels = this.g.selectAll(".labels")
				.data(this.visData,function(d){ return d.text; });
		labels.enter()
			.append("text")
			.attr("class","labels")
			.attr("transform", function (d) {
				var sectorWidth = d.endAngle-d.startAngle;
				var textAngle = d.startAngle + sectorWidth/2;
				var xPos = (that.outerRadius+70) * Math.sin(textAngle);
				var yPos = -(that.outerRadius+70) * Math.cos(textAngle);

				return "translate("+xPos+","+yPos+")";
			})
			.text(function(d){
				return d.text;
			})
			.style("fill",function(d){
				return d.color;
			})
			.style("opacity",0)
			.transition().delay(this.delayTime).duration(this.animationTime)
			.style("opacity", 1);;
	}



}
