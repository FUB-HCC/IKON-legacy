var svgGlobal =null;

Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
Math.degrees = function(radians) {
  return radians * 180 / Math.PI;
};

function createSvg(selector){
	var width = $(selector).width(),
	    height = $(selector).height()-4,
	    radius = (Math.min(width, height) / 2) - 10;

	var svg = d3.select(selector).append("svg")
		.attr("class","svgGlobal")
	    .attr("width", width)
	    .attr("height", height);

	svg.append("g")
    	.attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")");

    svgGlobal = svg
}

function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

function vecMinus(v1,v2){
	return {x:(v1.x-v2.x),y:(v1.y-v2.y)};
}

function distance(p1,p2){
	return Math.sqrt(Math.pow(p1.x-p2.x,2)+Math.pow(p1.y-p2.y,2));
}

//0° ist oben
function radBetweenVectors(v1,v2){
	var dot = v1.x*v2.x + v1.y*v2.y;
	var det = v1.x*v2.y - v1.y*v2.x;
	var angle = Math.atan2(det, dot);// -180, 180
	angle= -angle;
	if(angle<0){
		angle+=Math.PI*2;
	}
	return angle;

}


function isInSector(startAngleRad,endAngleRad, radius, middle, point){
    //startAngle 0° entspricht -90°
    //endAngle 360° entspricht 270°
	//point = {x:double,y:double}
    //(startAngleRad, endAngleRad, radius, middle) definiert den Sector und seine Position

    // result :  Boolean
	//			true  Point ist in dem Sector
	//			false Point ist außerhalb des Sektors

	var angle = radBetweenVectors(vecMinus(point,middle),{x:0,y:-1});

	//angle drehen, sodass 0° links ist
	angle = Math.radians((Math.degrees(angle)+90)%360);
	var dist = distance(middle,point);
	if(startAngleRad <= angle && angle <= endAngleRad && dist <= radius){
		return true;
	}else{
		return false;
	}


}