function createStreamGraph(fbProjects, allProjects){
  //fbProjects [[allProjects of Fb1],...] TODO

  var fbNebenthemen = [["Mikroevolution","Evolutionäre Morphologie","Diversitätsdynamik","Impakt- und Meteoritenforschung"],
    ["Biodiversitätsentdeckung","Sammlungsentwicklung","Kompetenzzentrum Sammlung"],
    ["IT- Forschungsinfrastrukturen","Wissenschaftsdatenmanagement","Biodiversitäts- und Geoinformatik"],
    ["Ausstellung und Wissenstransfer","Bildung und Vermittlung","Wissenschaft in der Gesellschaft","Perspektiven auf Natur - PAN","Historische Arbeitsstelle"]];
  var colorFb = [["#5e6d2d","#7d913c","#9cb54b"],["#c8e012","#d9ef36","#e2f365"],
                 ["#656890","#8184a7","#9fa1bc"],["#773f40","#985152","#b06c6d"]];
  //d3.stackOffsetWiggle      Wavy
  //d3.stackOffsetSilhouette  WavyCenter
  //d3.stackOffsetExpand      Square
  //d3.stackOffsetNone        OnTopOfEachOther

  //d3.stackOrderAscending    Order
  var bumpNumber = 200;
  var max = d3.max(allProjects, function(d) { return d.end; });
  var min = d3.min(allProjects, function(d) { return d.start; });
  var dates = [];

  for (var i = 0; i < bumpNumber; i++) {
    dates.push(new Date(min.getTime() + ((max.getTime()-min.getTime())*i)/(bumpNumber-1)));
  }
  var layers = createNebenThemenData(allProjects,dates),
      allLayers = layers;

  var svg = svgGlobal,
      width = +svg.attr("width")/2,
      height = +svg.attr("height")/2,
      g = svg.append("g")
          .attr("transform",
                "translate(" + (width/2) + "," + (height/2) + ")");

  var x = d3.scaleTime()
    .domain([min,max])
    .range([0, width]);

  var y = d3.scaleLinear()
      .domain([d3.min(allLayers, stackMin), d3.max(allLayers, stackMax)])
      .range([height, 0]);

  var z = d3.interpolateCool;

  //Important .curve(d3.curveBasis) smooth out the data
  var area = d3.area().curve(d3.curveBasis)
      .x(function(d, i) { return x(dates[i]); })
      .y0(function(d) { return y(d[0]); })
      .y1(function(d) { return y(d[1]); });

  g.selectAll("path")
    .data(layers)
    .enter().append("path")
      .attr("d",function(d) {
        return area(d.data);
      })
      .attr("stroke", function(d) { return d.color; })
      .attr("fill", function(d) { return d.color; });

  g.append("g")
      .attr("class", "xAxis")
      .attr("transform", "translate(0, "+(height+15)+")")
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y")))
      .selectAll("path")
        .attr("stroke","#88a");
  g.selectAll(".xAxis line")
        .attr("fill","#88a")
        .attr("stroke","#88a");
  var dateStart = new Date();
  g.append("line")
    .attr("stroke","#f0faf0")
      .attr("y1", -5)
      .attr("y2", height+10)
      .attr("x1", x(dateStart))
      .attr("x2", x(dateStart));


  g.append('circle')
    .style("fill","#f0faf0")
      .attr("r", 4)
      .attr('cx', x(dateStart))
      .attr('cy', -5);

  g.append('circle')
      .style("fill","#f0faf0")
      .attr("r", 4)
      .attr('cx', x(dateStart))
      .attr('cy', height+10);
  /*setTimeout(function() {
    transition();
  }, 3000);*/
  function stackMax(layer) {
    return d3.max(layer.data, function(d) { return d[1]; });
  }

  function stackMin(layer) {
    return d3.min(layer.data, function(d) { return d[0]; });
  }

  function transition() {
    var t;
    d3.selectAll("path")
      .data((t = layers1, layers1 = layers0, layers0 = t))
      .transition()
        .duration(2500)
        .attr("d", function(d) {
          return area(d.data);
        });
  }
  function createStreamGraphData(fbProjects,dates){
    var allBumps=[];
    for (var i = 0; i < fbProjects.length; i++) {
      allBumps.push(calcBumps(fbProjects[i],dates,0));
    }
    var stack = d3.stack().keys(d3.range(allBumps.length)).offset(d3.stackOffsetNone);
    var stackData = stack(d3.transpose(allBumps));
    for (var i = 0; i < stackData.length; i++) {
      stackData[i] = {
        color: colorFb[i][1],
        data: stackData[i]
      }
    }
    return stackData;
  }
  function createNebenThemenData(allProjects,dates){
    var nebenthemen = [];
    for (var i = 0; i < allProjects.length; i++) {
      for (var j = 0; j < allProjects[i].nebenthemen.length; j++) {
        var isExisting=false;
        for (var k = 0; k < nebenthemen.length; k++) {
          if(nebenthemen[k].nebenthema === allProjects[i].nebenthemen[j]){
            nebenthemen[k].projects.push(allProjects[i]);
            isExisting=true;
            break;
          }
        }
        if(!isExisting){
          var tmpFb = -1;
          for (var k = 0; k < fbNebenthemen.length; k++) {

            if(fbNebenthemen[k].indexOf(allProjects[i].nebenthemen[j]) !== -1){
              tmpFb=k;
              break;
            }
          }
          var fbScale = d3.scaleLinear()
                  .domain([0, fbNebenthemen[tmpFb].length-1])
                  .interpolate(d3.interpolateRgb)
                  .range([colorFb[tmpFb][0],colorFb[tmpFb][2]]);
          nebenthemen.push({
            fb: tmpFb,
            themaNum: fbNebenthemen[tmpFb].indexOf(allProjects[i].nebenthemen[j]),
            color: fbScale(fbNebenthemen[tmpFb].indexOf(allProjects[i].nebenthemen[j])),
            nebenthema: allProjects[i].nebenthemen[j],
            projects: [allProjects[i]],
            data: null
          });
        }
      }
    }

    nebenthemen.sort(function(a,b){
      // 1 bedeutet  a>b
      // -1 bedeutet a<b
      // 0 bedeutet a=b
      if(a.fb<b.fb){
        return -1;
      }else if(a.fb>b.fb){
        return 1;
      }else {
        if(a.themaNum<b.themaNum){
          return -1;
        }else if(a.themaNum>b.themaNum){
          return 1;
        }else{
          return 0;
        }
      }
    });
    var allBumps = [];
    for (var i = 0; i < nebenthemen.length; i++) {
      allBumps.push(calcBumps(nebenthemen[i].projects,dates,0));
    }
    var stack = d3.stack().keys(d3.range(allBumps.length)).offset(d3.stackOffsetSilhouette);
    var stackData = stack(d3.transpose(allBumps));

    //stack into format
    for (var i = 0; i < nebenthemen.length; i++) {
      nebenthemen[i].data = stackData[i];
    }
    return nebenthemen;
  }
  function calcBumps(projects,dates,offset){
    var bumps = [];
    for (var i = 0; i < dates.length; i++) {
      bumps.push(numberOfProjectsOnDay(projects,dates[i]));
    }
    for (var i = 0; i < offset; i++) {
      bumps[0].splice(0, 1)
      bumps[0].push(0);
    }
    return bumps
  }

  function numberOfProjectsOnDay(projects,day){
    var count = 0;
    for (var i = 0; i < projects.length; i++) {
      if(projects[i].start.getTime() < day.getTime() &&
         day.getTime() < projects[i].end.getTime()){
        count++;
      }
    }
    return count;
  }
}