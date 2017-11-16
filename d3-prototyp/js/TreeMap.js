function createTreeMap(allProjects){
	var tmpP = allProjects[0];
	var data = {
      name: "All",
      children: [
        {
          head: "Titel",
          name: tmpP.titel,
          value: 144
        },
        {
          head: "Projektleiter",
          name: tmpP.projektleiter,
          value: 55
        },
        {
          head: "Forschungsbereich",
          name: tmpP.forschungsbereich,
          value: 55
        },
        {
          head: "Antragsteller",
          name: tmpP.antragsteller,
          value: 34
        },
        {
          head: "Kooperationspartner",
          name: tmpP.kooperationspartner,
          value: 34
        },
        {
          head: "Geldgeber",
          name: tmpP.geldgeber,
          value: 34
        },
        {
          head: "Projektnummer",
          name: tmpP.id,
          value: 21
        },
        {
          head: "Anfang",
          name: tmpP.start,
          value: 21
        },
        {
          head: "Ende",
          name: tmpP.end,
          value: 21
       },
        {
          head: "Hauptthema",
          name: tmpP.hauptthema,
          value: 89
        },
        {
          head: "Nebenthemen",
          name: tmpP.nebenthemen,
          value: 21
        }
      ]
    };
    var g = svgGlobal.append("g")
    			.attr("class","treemap")
    			.attr("transform",
			 	 "translate(" + (svgGlobal.attr("width")/4) + "," + (svgGlobal.attr("height")/4) + ")");

    var treemap = d3.treemap().size([svgGlobal.attr("width")/2, svgGlobal.attr("height")/2]);


    var root = d3.hierarchy(data).sum(function (d) { return d.value; });
    var nodes = root.descendants();
    treemap(root);
    var cells = g.selectAll("g").data(nodes).enter()
    						.append("g")
    							.attr("class", "cell")
					            .attr("transform", function(d) {
					                return "translate(" + (d.x0) + "," + (d.y0) + ")";
					            });



	cells.append("rect")
			.attr("fill-opacity",0)
			.attr("width", function (d) { return d.x1 - d.x0; })
        	.attr("height", function (d) { return d.y1 - d.y0; });

	//SVG has no Text Wrap
	//Warning doesnot work with IE but there is an alternative http://bl.ocks.org/jensgrubert/7943555
    cells.append("foreignObject")
            .attr("class", "foreignObject")
            .attr("width", function(d) {
                return d.x1 - d.x0;
            })
            .attr("height", function(d) {
                return d.y1 - d.y0;
            })
          .append("xhtml:body")
            .attr("class", "labelbody")
            .style("height","100%")
          .append("div")
            .attr("class", "label")
            .text(function(d) {
                return d.data.head +": "+d.data.name;
            })
            .attr("text-anchor", "middle")
            .style("height", "100%")
            .style("background","rgba(0,0,0,0.1)")
			.style("outline","0.2px solid #985152 ");

	setTimeout(function(){
		treemap.transition()
        	.duration(1500);
	},3000)
}