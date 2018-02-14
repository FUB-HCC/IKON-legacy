class PieChart{
	/*
		Displays Piechart
		TODO:
			1. Rethink pieData
			2. improve LabelFadeIn
			3. Add different Types
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
		this.animationTime = 1500;
		this.delayTime = 0;
		this.type = type;
		this.data = data;
		/*
			[{text:,startAngle:, endAngle:,color:},...]
			Each json in this Array defines a part of the Circle.
		*/
		this.visData = this._processData(data,type);
		this.pie = d3.pie().sort(null)
      		.value(function (d) {
        		return d.count;
      		});
		this.pieData = this.pie(this.visData);

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
		this.pieData = this.pie(this.visData);
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
		this.pieData = this.pie(this.visData);
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
		var result = null;
		switch(type) {
			case "forschungsbereiche":
				result = this._processFbs(data, type);
				break;
			case "kooperationspartner":
				//TODO
				break;
			default:
				console.log("PieChart Error: Unkown type");
		}
		return result;
	}
	_processFbs(data, type){
		var splitFbs =[];
		for (var i = 0; i < 4; i++) {
			splitFbs.push({
				text: 			"Forschungsbereich " + (i+1),
				oldStartAngle: 	Object.is(this.pieData, undefined) ? (-(2*Math.PI)/4) : this.pieData[i].startAngle,
				oldEndAngle: 	Object.is(this.pieData, undefined) ? (-(2*Math.PI)/4) : this.pieData[i].endAngle,
				color: 			this.colors.fb[(i+1)],
				count: 			0
			});
		}

		//Count Number of Projects per fb
		var pId;
		for (pId in data) {
			splitFbs[data[pId].forschungsbereich - 1].count++;
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
		//weird AttrTween behaviour on exit and update avoid them
		var that = this;
		var arcs = this.g.selectAll(".arcs")
				.data(this.pieData);
		arcs.enter().append("path")
				.attr("class", "arcs")
				.style("fill",function(d){ return d.data.color; })
				.merge(arcs) //update Solution arcs.transition() was not working
				.transition()
				.delay(this.delayTime)
				.duration(this.animationTime)
				.attrTween("d",function(d){
					var offSet= -(2*Math.PI)/4;
					var interpolateStartAngle = d3.interpolate(	d.data.oldStartAngle ,
																d.startAngle + offSet );
					var interpolateEndAngle = d3.interpolate( d.data.oldEndAngle,
															  d.endAngle + offSet );
					return function(t) {
						d.startAngle = interpolateStartAngle(t);
						d.endAngle = interpolateEndAngle(t);
						return that.arc(d);
					};
				});
	}
	_updateLabels(){
		var that = this;
		var labels = this.g.selectAll(".labels")
				.data(this.pieData);
		labels.enter()
			.append("text")
			.attr("class","labels")
			.text(function(d){
				return d.data.text;
			})
			.style("fill",function(d){
				return d.data.color;
			})
			.style("opacity",0)
			.merge(labels)
			.transition().delay(this.delayTime).duration(this.animationTime)
			.attrTween("transform", function (d) {
				var offSet = -(2*Math.PI)/4;
				var sectorWidth = d.endAngle-d.startAngle;
				var textAngle = d.startAngle + sectorWidth/2;

				var oldSectorWidth = d.data.oldEndAngle - d.data.oldStartAngle;
				var oldTextAngle = d.data.oldStartAngle + oldSectorWidth/2;

				var interpolateTextAngle = d3.interpolate(oldTextAngle,textAngle+offSet);
				return function(t) {
					var xPos = (that.outerRadius+70) * Math.sin(interpolateTextAngle(t));
					var yPos = -(that.outerRadius+70) * Math.cos(interpolateTextAngle(t));
					return "translate("+xPos+","+yPos+")";
				};
			})
			.style("opacity", function(d){
				if(d.startAngle===d.endAngle){
					return 0;
				}else{
					return 1;
				}
			});
	}



}
