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


function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

function shadeHexColor(color, percent) {
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}

function blendHexColor(c0, c1, p) {
    var f=parseInt(c0.slice(1),16),t=parseInt(c1.slice(1),16),R1=f>>16,G1=f>>8&0x00FF,B1=f&0x0000FF,R2=t>>16,G2=t>>8&0x00FF,B2=t&0x0000FF;
    return "#"+(0x1000000+(Math.round((R2-R1)*p)+R1)*0x10000+(Math.round((G2-G1)*p)+G1)*0x100+(Math.round((B2-B1)*p)+B1)).toString(16).slice(1);
}

function vecMinus(v1,v2){
	return {x:(v1.x-v2.x),y:(v1.y-v2.y)};
}

function distance(p1,p2){
	return Math.sqrt(Math.pow(p1.x-p2.x,2)+Math.pow(p1.y-p2.y,2));
}

function radBetweenVectors(v1,v2){
	var dot = v1.x*v2.x + v1.y*v2.y;
	var det = v1.x*v2.y - v1.y*v2.x;
	var angle = Math.atan2(det, dot);// -180, 180
	angle = -angle;
	if(angle < 0){
		angle = (angle+Math.PI*2)%(Math.PI*2);
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

	var angle = radBetweenVectors(vecMinus(point,middle),{x:-1,y:0});
	var dist = distance(middle,point);
	//+(Math.PI*2)/4 weil es bei uns links anfängt
	if(startAngleRad+(Math.PI*2)/4 < angle && angle < endAngleRad+(Math.PI*2)/4 && dist <= radius){
		return true;
	}else{
		return false;
	}


}