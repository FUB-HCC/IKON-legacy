class RadialChartPIXI {
    constructor(stage) {
    	this.sectors = null;//[{text:"",percentage:0,percentageSum:0,color:"",projects:[]},...]
		this.arcs = null;// gfx:null,startAngle:0,endAngle:0,interpolateStartAngle:null, interpolateEndAngle:null

		//TODO
		this.stage = stage;
		this.width = 500;
		this.height = 500;

		this.fade = 0; //-1 - FadeOut  0 - noFade Active   1 - FadeIn
		this.animationStartTime = null;
    	this.animationDuration = null;
    }

    setData(sectors){
		this.sectors = sectors;
		this.arcs = this.createArcs();
    }
    createArcs(){
    	var that= this;
    	var tmpArcs = []
		for (var i = 0; i < this.sectors.length; i++) {
			var gfxArc = new PIXI.Graphics();
		    gfxArc.beginFill(0xffffff,0);
		    gfxArc.lineStyle(20, 0xff00ff,1);
		    gfxArc.arc(0, 0, 220, -(2 * Math.PI)/4, -(2 * Math.PI)/4); // cx, cy, radius, startAngle, endAngle
		    gfxArc.position = {x: this.width/2, y: this.height/2};
		    this.stage.addChild(gfxArc);

		    tmpArcs.push({
		    	gfx: 		gfxArc,
		    	startAngle: -(2 * Math.PI)/4,
		    	endAngle: 	-(2 * Math.PI)/4,
		    	interpolateStartAngle: 	null,
		    	interpolateEndAngle: 	null
		    });

	    }
	    return tmpArcs;
    }
    update(){
    	//Bad not smooth because of irregular calls
    	if(this.fade != 0){
    		var animDelta = (Date.now()-this.animationStartTime);
    		if(animDelta >= this.animationDuration){
    			//If this function is here suspended from the CPU and FadeOut/IN is executed
    			//errors might occur with the interpolation
    			this.fade = 0;
    			animDelta = this.animationDuration;//To end the interpolation at exactly 1
    		}
    		for (var i = 0; i < this.arcs.length; i++) {
    			//console.log(this.arcs[i].interpolateEndAngle(animDelta/this.animationDuration))
    			this.arcs[i].endAngle = this.arcs[i].interpolateEndAngle(animDelta/this.animationDuration);
    			this.arcs[i].startAngle = this.arcs[i].interpolateStartAngle(animDelta/this.animationDuration);
    		}
    	}

    }
    draw(){
    	//console.log(this.arcs);
    	for (var i = 0; i < this.arcs.length; i++) {
    		var tmpArc = this.arcs[i].gfx;
    		tmpArc.clear();
	      	tmpArc.beginFill(0xffff00,0);

	    	tmpArc.lineStyle(20, parseInt(this.sectors[i].color.substring(1), 16),1);
	    	//console.log(this.arcs);

	    	//start and endAngle opposite values and missing the (- (2*Math.PI)/4)
	    	tmpArc.arc(0, 0, 220, this.arcs[i].endAngle- ((2*Math.PI)/4), this.arcs[i].startAngle - ((2*Math.PI)/4)+0.002 );
    	}
    }

	//FadeIn and FadeOut Work even when the other one is Still active
	//Only if one of them is suspended from the CPU during execution and the other function
	//continues Problems might occur

	//Solution: Update, FadeIn and FadeOut have to wait for each other to finish before the
	//			next one starts OR fadeIN and fadeOut only execute when fade is 0
    fadeIn(animationDuration){

    	this.fade = 1;
    	for (var i = 0; i < this.arcs.length; i++) {
    		console.log(this.arcs[i].startAngle);
    		this.arcs[i].interpolateStartAngle = d3.interpolate(this.arcs[i].startAngle,
    			(this.sectors[i].percentageSum)*(2*Math.PI) - (2*Math.PI)/4 );

    		this.arcs[i].interpolateEndAngle = d3.interpolate(this.arcs[i].endAngle,
    			((this.sectors[i].percentageSum)-this.sectors[i].percentage)*(2*Math.PI) - (2*Math.PI)/4 );
    	}
    	this.animationStartTime = Date.now();
    	this.animationDuration = animationDuration;
    }
    fadeOut(animationDuration){
	 	this.fade = -1;
    	for (var i = 0; i < this.arcs.length; i++) {
    		this.arcs[i].interpolateStartAngle = d3.interpolate(this.arcs[i].startAngle, -(2*Math.PI)/4 );
    		this.arcs[i].interpolateEndAngle = d3.interpolate(this.arcs[i].endAngle, -(2*Math.PI)/4 );
    	}
    	this.animationStartTime = Date.now();
    	this.animationDuration = animationDuration;
    }
}
