function createIcicle(allProjects){

  var fbThemen = [["Mikroevolution","Evolutionäre Morphologie","Diversitätsdynamik","Impakt- und Meteoritenforschung"],
    ["Biodiversitätsentdeckung","Sammlungsentwicklung","Kompetenzzentrum Sammlung"],
    ["IT- Forschungsinfrastrukturen","Wissenschaftsdatenmanagement","Biodiversitäts- und Geoinformatik"],
    ["Ausstellung und Wissenstransfer","Bildung und Vermittlung","Wissenschaft in der Gesellschaft","Perspektiven auf Natur - PAN","Historische Arbeitsstelle"]];
  var colorFb = [["#5e6d2d","#7d913c","#9cb54b"],["#c8e012","#d9ef36","#e2f365"],
                 ["#656890","#8184a7","#9fa1bc"],["#773f40","#985152","#b06c6d"]];

  var width = +svgGlobal.attr("width")/2,
    height = +svgGlobal.attr("height")/2,
    mask = svgGlobal
     .append("defs")
     .append("mask")
     .attr("id", "icicleMask");

  mask.append("rect")
     .attr("width",width)
     .attr("height",height)
     .style("fill","#fff");

  var g = svgGlobal.append("g")
        .attr("width",width)
        .attr("height",height)
        .attr("mask", "url(#icicleMask)")
        .attr("transform",
              "translate(" + (width/2) + "," + (height/2) + ")");


  var x = d3.scaleLinear()
      .range([0, width]);

  var y = d3.scaleLinear()
      .range([0, height]);

  var color = d3.scaleOrdinal(d3.schemeCategory20c);

  var partition = d3.partition()
      .size([width, height])
      .padding(0)
      .round(true);

  var rect = g.selectAll("rect");
  var data = {
    "MFN":{
      "name":"Museum für Naturkunde",
      "color":"#FFAC2E"
    },
    "PB1":{
      "name":"Dynamik der Natur",
      "color":"#A7BC39"
    },
    "PB2":{
      "name":"Natur und Gesellschaft",
      "color":"#8B6D80"
    },
    "FB1":{
      "name":"Evolution und Geoprozesse",
      "color":colorFb[0][1]
    },
    "FB2":{
      "name":"Sammlungsentwicklung und Biodiversitätsentdeckung",
      "color":colorFb[1][1]
    },
    "FB3":{
      "name":"Digitale Welt und Informationswissenschaft",
      "color":colorFb[2][1]
    },
    "FB4":{
      "name":"Wissenschaftskommunikation und Wissensforschung",
      "color":colorFb[3][1]
    }
  }

  //d3.partition calulates the width height,Position of the Rectangles and requires the data to be in
  //this format. A better solution for the data structure would be to change the partition code
  //which is bad for the code.

  //Each Key can be mapped to the data JSON to access its additional data
  var icicleJson = {
    "MFN": {
      "PB1":{
        "FB1": {},
        "FB2": {}
      },
      "PB2":{
        "FB3": {},
        "FB4": {}
      }
    }
  };
  //push projects and hauptthemen into icicleJson add data
  //similar to Streamgraph.js
  for (var i = 0; i < allProjects.length; i++) {
    var isExisting=false;
    var tmpFb = allProjects[i].forschungsbereich;
    var tmpHt = allProjects[i].hauptthema;
    var relevantJson = icicleJson["MFN"]["PB"+Math.ceil(tmpFb/2)]["FB"+tmpFb];
    for (var hauptthema in relevantJson) {
      if (relevantJson.hasOwnProperty(hauptthema) && hauptthema === tmpHt) {
        //add Project to Icicle
        icicleJson["MFN"]["PB"+Math.ceil(tmpFb/2)]["FB"+tmpFb][hauptthema][allProjects[i].id] = 1;
        //add Project to data

        data[allProjects[i].id] = {
          project: allProjects[i],
          name: allProjects[i].titel,
          color: data[tmpHt].color
        };
        //add Project to Hauptthema
        data[tmpHt].projects.push(allProjects[i]);
        isExisting=true;
        break;
      }
    }
    if(!isExisting){
      var fbScale = d3.scaleLinear()
              .domain([0, fbThemen[tmpFb-1].length-1])
              .interpolate(d3.interpolateRgb)
              .range([colorFb[tmpFb-1][0],colorFb[tmpFb-1][2]]);

      data[tmpHt] = {
        color: fbScale(fbThemen[tmpFb-1].indexOf(tmpHt)),
        name: tmpHt,
        projects: [allProjects[i]]
      };
      data[tmpHt].projects.push(allProjects[i]);

      icicleJson["MFN"]["PB"+Math.ceil(tmpFb/2)]["FB"+tmpFb][tmpHt] = {};
      icicleJson["MFN"]["PB"+Math.ceil(tmpFb/2)]["FB"+tmpFb][tmpHt][allProjects[i].id] = 1;

      data[allProjects[i].id] = {
        project: allProjects[i],
        name: allProjects[i].titel,
        color: data[tmpHt].color
      };
    }
  }
  root = d3.hierarchy(d3.entries(icicleJson)[0], function(d) {
      return d3.entries(d.value)
    })
    .sum(function(d) { return d.value })
    .sort(function(a, b) { return b.value - a.value; });
  partition(root);
  rect = rect
      .data(root.descendants())
    .enter().append("rect")
      .attr("x", function(d) { return d.x0; })
      .attr("y", function(d) { return d.y0; })
      .attr("width", function(d) { return d.x1 - d.x0; })
      .attr("height", function(d) { return d.y1 - d.y0; })
      .attr("fill", function(d) { return data[d.data.key].color; })
      .on("click", clicked);
  g.selectAll(".label")
      .data(root.descendants().filter(function(d) { return (d.x1-d.x0) > 10; }))
    .enter().append("text")
      .attr("class", "label")
      /*.attr("textLength", function(d) { return (d.x1-d.x0); })*/
      .attr("transform", function(d) { return "translate(" + (d.x0 + (d.x1-d.x0) / 2) + "," + (d.y0 + (d.y1-d.y0) / 2) + ")rotate(0)"; })
      .style("text-anchor", "middle")
      .style("fill","#fff")
      .text(function(d) {
        return data[d.data.key].name;
        /*return d.data.key;*/
      });

  function clicked(d) {
    console.log(data[d.data.key]);
    x.domain([d.x0, d.x1]);
    y.domain([d.y0, height]).range([d.depth ? 20 : 0, height]);
    g.selectAll(".label").transition()
        .duration(750)
        .attr("transform", function(d) { return "translate(" + x(d.x0 + (d.x1-d.x0) / 2) + "," + y(d.y0 + (d.y1-d.y0) / 2) + ")rotate(0)"; })
    rect.transition()
        .duration(750)
        .attr("x", function(d) { return x(d.x0); })
        .attr("y", function(d) { return y(d.y0); })
        .attr("width", function(d) { return x(d.x1) - x(d.x0); })
        .attr("height", function(d) { return y(d.y1) - y(d.y0); });
  }
}