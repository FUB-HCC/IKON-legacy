
function createBarChart(allProjects) {
	var width = svgGlobal.attr("width"),
		height = svgGlobal.attr("height");
	var colors = ["#985152","#7d913c","#8184a7","#d9ef36"];
	//var parseTime = d3.timeParse("%d-%b-%y");
	var x = d3.scaleBand()
			  .range([0, width/2])
			  .padding(0.1);
	var y = d3.scaleTime()
			  .range([height/2, 0]);
	var svg = svgGlobal.append("g")
			.attr("transform",
			 	 "translate(" + (width/4) + "," + (height/4) + ")");
	var data = [[],[],[],[]];

	for (var i = 1; i < allProjects.length; i++) {
		var d={
			num: 0,
			fb: allProjects[i].fachbereich-1,
			startDate: allProjects[i].start,
			endDate: allProjects[i].end,
			pnum: allProjects[i].title
		}
		data[allProjects[i].fachbereich-1].push(d);
	}
	var tmpData = JSON.parse(JSON.stringify(data))
	function endDateSort(a, b) {
		return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
	}
	function numSort(a, b) {
		return a.num - b.num;
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
	function orderArr(data){
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
		return sortedData;
	}
	data2 = orderArr(data[0]).concat(orderArr(data[1])).concat(orderArr(data[2])).concat(orderArr(data[3]));
	console.log(tmpData);
	var prevfb=0
	data=[];
	for (var i = 0; i < data2.length ; i++) {
		var plus=0;
		for (var j = 0; j < data2[i].fb; j++) {
			plus += tmpData[j].length+5;
		}

		if(prevfb != data2[i].fb){
			prevfb=data2[i].fb;
			data.push({num:(data2[i].num + plus-5),startDate:null,endDate:null});
			data.push({num:(data2[i].num + plus-4),startDate:null,endDate:null});
			data.push({num:(data2[i].num + plus-3),startDate:null,endDate:null});
			data.push({num:(data2[i].num + plus-2),startDate:null,endDate:null});
			data.push({num:(data2[i].num + plus-1),startDate:null,endDate:null});
		}
		data2[i].num = data2[i].num + plus;
	}

	data = data.concat(data2);
	console.log(data);
	var res =[];
	var lastCut=-1;
	data.sort(numSort);
	for (var i = 1; i < data.length; i++) {
		if(data[i].startDate == null&&data[i-1].startDate != null){
			var tmpA = data.slice(lastCut+1,i-1);
			res = res.concat(shuffleArray(tmpA));
			lastCut = i-1;
		}else if(data[i].startDate != null&&data[i-1].startDate == null){
			var tmpA = data.slice(lastCut,i-1);
			res = res.concat(tmpA);
			lastCut = i-1;
		}
	}
	res = res.concat(shuffleArray(data.slice(lastCut+1,data.length)));
	data = res;
	//console.log(data);

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
		.attr("stroke",function(d) {
			return colors[d.fb];
		})
		.style('fill',function(d) {
			return colors[d.fb];
		})
		.attr("x", function(d) { return x(d.num); })
		.attr("width", x.bandwidth()-3)
		.attr("y", function(d) { return y(d.endDate); })

		.attr("height", function(d) { return  y(d.startDate) - y(d.endDate);});
	var d = new Date();
	var t = new Date(new Date().getTime() + 7*24 * 60 * 60 * 1000);
	svg.append("line")
		.attr("stroke","#faf0fa")
   		.attr("y1", y(d))
   		.attr("y2", y(t))
   		.attr("x1", -5)
   		.attr("x2", width/2+5);

   	svg.append('circle')
   	.style("fill","#faf0fa")
		  .attr("r", 4)
		  .attr('cx', -5)
		  .attr('cy', y(d))

	svg.append('circle')
			.style("fill","#faf0fa")
		  .attr("r", 4)
		  .attr('cx', width/2+5)
		  .attr('cy', y(d))
}
