function createStreamGraph(fbProjects, allProjects){
  var n = 4, // number of layers
      m = 100, // number of samples per layer
      k = 10; // number of bumps per layer
  console.log(fbProjects);
  var colorFb = ["#7d913c","#d9ef36","#8184a7","#985152"];
  //d3.stackOffsetWiggle  Wavy
  //d3.stackOffsetNone    OnTopOfEachOther
  var stack = d3.stack().keys(d3.range(n)).offset(d3.stackOffsetNone),
      layers0 = stack(d3.transpose(calcBumps(fbProjects,allProjects,m))),
      layers1 = stack(d3.transpose(calcBumps(fbProjects,fbProjects[1],m))),
      /*layers0 = stack(d3.transpose(d3.range(n).map(function() { return bumps(m, k); }))),
      layers1 = stack(d3.transpose(d3.range(n).map(function() { return bumps(m, k); }))),*/
      layers = layers0.concat(layers1);

  calcBumps(fbProjects,allProjects,10);
  for (var i = 0; i < layers0.length; i++) {
    layers0[i] = {
        color: colorFb[i],
        data: layers0[i]
    }
  }
  for (var i = 0; i < layers1.length; i++) {
    layers1[i] = {
        color: colorFb[i],
        data: layers1[i]
    }
  }
  console.log(layers0);
  var svg = svgGlobal,
      width = +svg.attr("width")/2,
      height = +svg.attr("height")/2,
      g = svg.append("g")
          .attr("transform",
                "translate(" + (width/2) + "," + (height/2) + ")");

  var x = d3.scaleLinear()
      .domain([0, m - 1])
      .range([0, width]);

  var y = d3.scaleLinear()
      .domain([d3.min(layers, stackMin), d3.max(layers, stackMax)])
      .range([height, 0]);

  var z = d3.interpolateCool;

  var area = d3.area().curve(d3.curveBasis)
      .x(function(d, i) { return x(i); })
      .y0(function(d) { return y(d[0]); })
      .y1(function(d) { return y(d[1]); });

  g.selectAll("path")
    .data(layers0)
    .enter().append("path")
      .attr("d",function(d) {
        return area(d.data);
      })
      .attr("fill", function(d) { return d.color; });
  setTimeout(function() {
    transition();
  }, 3000);
  function stackMax(layer) {
    return d3.max(layer, function(d) { return d[1]; });
  }

  function stackMin(layer) {
    return d3.min(layer, function(d) { return d[0]; });
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

  // Inspired by Lee Byron’s test data generator.
  function bumps(n, m) {
    var a = [], i;
    for (i = 0; i < n; ++i) a[i] = 0;
    for (i = 0; i < m; ++i) bump(a, n);
    console.log(a);
    return a;
  }

  function bump(a, n) {
    var x = 1 / (0.1 + Math.random()),
        y = 2 * Math.random() - 0.5,
        z = 10 / (0.1 + Math.random());
    for (var i = 0; i < n; i++) {
      var w = (i / n - y) * z;
      a[i] += x * Math.exp(-w * w);
    }
  }

  function calcBumps(fbProjects,allProjects,bumpsNum){
    var max = d3.max(allProjects, function(d) { return d.end; });
    var min = d3.min(allProjects, function(d) { return d.start; });
    var dates = [];
    var allBumps = [[],[],[],[]];
    for (var i = 0; i < bumpsNum; i++) {
      dates.push(new Date(min.getTime() + ((max.getTime()-min.getTime())*i)/(bumpsNum-1)));
    }
    for (var i = 0; i < dates.length; i++) {
      for (var j = 0; j < fbProjects.length; j++) {
        allBumps[j].push(numberOfProjectsOnDay(fbProjects[j],dates[i]));
      }
    }

    return allBumps

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