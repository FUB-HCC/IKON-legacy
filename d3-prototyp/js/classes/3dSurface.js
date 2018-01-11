function create3dSurface(allProjects){
    var origin = [480, 250],
        j = 5,
        points = [],
        alpha = 0,
        beta = 0,
        startAngle = Math.PI/4;

    var svg    = svgGlobal.call(d3.drag().on('drag', dragged).on('start', dragStart).on('end', dragEnd)).append('g');
    svgGlobal.call(d3.zoom()
        .scaleExtent([0.1, 80])
        .on("zoom", zoomed));

    var mx, my, mouseX, mouseY;
    var xOffset = 0;
    var yOffset = 0;
    var surface = d3._3d()
        .scale(1)
        .x(function(d){ return d.x; })
        .y(function(d){ return d.y; })
        .z(function(d){ return d.z; })
        .origin(origin)
        .rotateY(startAngle)
        .rotateX(-startAngle)
        .shape('SURFACE', j*2);

    d3.select("body").on("keydown", function() {
        if(d3.event.key === "ArrowUp"){
            yOffset--;
        }else if(d3.event.key === "ArrowDown"){
            yOffset++;
        }else if(d3.event.key === "ArrowLeft"){
            xOffset--;
        }else if(d3.event.key === "ArrowRight"){
            xOffset++;
        }
        tmpO = [origin[0]+xOffset*5, origin[1]+yOffset*5];
        surface.origin(tmpO);
        processData(surface(points), 0);
    });
    var color = d3.scaleLinear();

    function processData(data, tt){

        var planes = svg.selectAll('path').data(data, function(d){ return d.plane; });

        planes
            .enter()
            .append('path')
            .attr('class', '_3d')
            .attr('fill', colorize)
            .attr('opacity', 0)
            .attr('stroke-opacity', 0.1)
            .merge(planes)
            .attr('stroke', 'black')
            .transition().duration(tt)
            .attr('opacity', 1)
            .attr('fill', colorize)
            .attr('d', surface.draw);

        planes.exit().remove();

        d3.selectAll('._3d').sort(surface.sort);

    }

    function colorize(d){
        var _y = (d[0].y + d[1].y + d[2].y + d[3].y)/4;
        return d3.interpolateSpectral(color(_y));
    }
    function zoomed(){
        processData(surface.scale(d3.event.transform.k)(points), 0);
    }

    function dragStart(){
        mx = d3.event.x;
        my = d3.event.y;
    }

    function dragged(){
        mouseX = mouseX || 0;
        mouseY = mouseY || 0;
        beta   = (d3.event.x - mx + mouseX) * Math.PI / 230 ;
        alpha  = (d3.event.y - my + mouseY) * Math.PI / 230  * (-1);
        processData(surface.rotateY(beta + startAngle).rotateX(alpha - startAngle)(points), 0);
    }

    function dragEnd(){
        mouseX = d3.event.x - mx + mouseX;
        mouseY = d3.event.y - my + mouseY;
    }

    function init(eq){
        points = [];
        var depthsum = 0;
        for(var z = -j; z < j; z++){
            for(var x = -j; x < j; x++){
                var tmpP = allProjects[((z+j)*10+x+j)];
                var depth = 0;
                for(obj in tmpP){
                    if(obj !== "" && obj !== null){
                        depth++;
                    }
                }

                depth += tmpP.nebenthemen.length-1;
                depthsum += depth;
                points.push({x: x, y: depth, z: z});
            }
        }
        var average = depthsum/((j*2)*(j*2));
        console.log(average);
        for (var i = 0; i < points.length; i++) {
            points[i].y = points[i].y - average;
            points[i].x = points[i].x ;
            points[i].z = points[i].z ;

        }

        var yMin = d3.min(points, function(d){ return d.y; });
        var yMax = d3.max(points, function(d){ return d.y; });

        color.domain([yMin, yMax]);
        processData(surface(points), 1000);
    }

    function change(){
        var rn1 = Math.floor(d3.randomUniform(1, 12)());
        var eqa = function(x, z){
            return Math.cos(Math.sqrt(x*x+z*z)/Math.PI)*rn1;
        };
        init(eqa);
    }

    d3.selectAll('button').on('click', change);

    change();
}