
function createBarChart(allProjects) {
	var width = svgGlobal.attr("width"),
		height = svgGlobal.attr("height");
	//var parseTime = d3.timeParse("%d-%b-%y");
	var x = d3.scaleBand()
			  .range([0, width/2])
			  .padding(0.1);
	var y = d3.scaleTime()
			  .range([height/2, 0]);
	var svg = svgGlobal.append("g")
			.attr("transform",
			 	 "translate(" + (width/4) + "," + (height/4) + ")");
	var data = [];
	for (var i = 1; i < allProjects.length; i++) {
		var d={
			num: 0	,
			startDate: allProjects[i].start,
			endDate: allProjects[i].end
		}
		data.push(d);
	}

	function endDateSort(a, b) {
		return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
	}
	function shuffleArray(array) {
	    for (var i = array.length - 1; i > 0; i--) {
	        var j = Math.floor(Math.random() * (i + 1));
	        var temp = array[i];
	        array[i] = array[j];
	        array[j] = temp;
	    }
	}
	data.sort(endDateSort);
	var sortedData=[];
	for (var i = 0; data.length > 0; i++) {
		data[0].num = i;
		var tmpP = data[0];
		sortedData.push(data[0]);
		data.splice(0,1);
		var foundFit = true;
		while(data.length > 0 && foundFit){
			foundFit = false;
			for (var j = 0; j < data.length; j++) {
				if(tmpP.endDate < data[j].startDate){
					data[j].num = i;
					tmpP = data[j];
					sortedData.push(data[j]);
					data.splice(j,1);
					foundFit = true;
					break;
				}
			}
		}
	}
	data = sortedData;
	//shuffleArray(data);
	//console.log(d3.max(data, function(d) { return d.endDate; }));
	//console.log(d3.min(data, function(d) { return d.startDate; }));
	x.domain(data.map(function(d) { return d.num; }));
	y.domain([d3.min(data, function(d) { return d.startDate; }),
			d3.max(data, function(d) { return d.endDate; })]);
	// add the y Axis
	var g = svg.append("g")
		.attr("class", "timeLine")
		.call(d3.axisRight(y).tickSize(width/2));
	g.select(".domain").remove();
  	g.selectAll(".tick line").attr("stroke", "#88a").attr("stroke-dasharray", "2,2");
  	g.selectAll(".tick text").attr("x", Number(g.select(".tick text").attr("x"))+20);

	// append the rectangles for the bar chart
	svg.selectAll(".bar")
		.data(data)
		.enter().append("rect")
		.attr("class", "bar")
		.attr("x", function(d) { return x(d.num); })
		.attr("width", x.bandwidth()-3)
		.attr("y", function(d) { console.log(d.startDate);return y(d.endDate); })

		.attr("height", function(d) { return  y(d.startDate) - y(d.endDate);});

}
