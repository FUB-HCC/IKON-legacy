class NetworkPIXI {
	//TODO LINKS richtig updatenim Projektgraph
	constructor(projects) {
		//Better in a separat Class Stage
		//and maybe a Class(or function) for the renderer (Singleton)
		var width = $("#chart").width(), height = $("#chart").height()-4;

        this.stage = new PIXI.Container();
        this.renderer = PIXI.autoDetectRenderer(width, height,
            {antialias: 1, transparent: 1, resolution: 1});
        document.getElementById("chart").appendChild(this.renderer.view);

        var pixiCanvas = d3.select('canvas');
        //.translateExtent([[-0,-0],[width,height]])
		pixiCanvas.call(d3.zoom().scaleExtent([0.5, 10]).on("zoom", zoom))
		var that = this;
		function zoom() {
			console.log(d3.event);
		    that.stage.position.x = d3.event.transform.x;
		    that.stage.position.y = d3.event.transform.y;
		    that.stage.scale.x = d3.event.transform.k;
		    that.stage.scale.y = d3.event.transform.k;
		}

		this.projects=projects;
		this.groupByUpdate = null;
		this.groupBy = "forschungsbereiche";//forschungsbereiche kooperationspartner geldgeber
		this.groupByConfig = {
			forschungsbereiche:{
				text:["Forschungsbereich 1","Forschungsbereich 2","Forschungsbereich 3","Forschungsbereich 4"],
				color:["#7d913c","#d9ef36","#8184a7","#985152"]
			},
			kooperationspartner:{
				text:[],
				color:[]
			},
			geldgeber:{
				text:[],
				color:[]
			}
		};
		//{text:"",percentage:0,percentageSum:0,color:"",projects:[]}
		this.groups = this.createGroups();
	    this.radialChart = new RadialChartPIXI(this.stage);
	    //this.projectGraph = new ProjectGraphPIXI(this.groups);
		this.animationTime = 2000;
		this.isOpen=false;
		this.hasFaded=false;
		//To render PIXI
		this.ticker = PIXI.ticker.shared;
        this.ticker.autoStart = true;
        this.ticker.add(this.update, this);
	}
	update(){
		if(this.groupByUpdate!=null){
			//Problem visualisation change while in an Animation
			if(this.isOpen){
				if(this.radialChart.fade === 0 && !this.hasFaded){
					this.hasFaded = true;
					this.radialChart.fadeOut(this.animationTime);
					//this.projectGraph.fadeOut(this.animationTime*2);
				}else if(this.radialChart.fade === 0 && this.hasFaded){
					this.isOpen=false;
				}
			}else{
				this.groupBy = this.groupByUpdate;
				this.groupByUpdate = null;
				this.isOpen=true;
				this.groups = this.createGroups();

				this.radialChart.setData(this.groups);
				this.radialChart.fadeIn(this.animationTime);
				//this.projectGraph.changeData(this.groups);
				//this.projectGraph.fadeIn(this.animationTime);


			}

		}
		if(this.isOpen){
			this.radialChart.update();
			this.radialChart.draw();
		}
		this.renderer.render(this.stage);

	}
	setVisualisation(groupBy){
		this.groupByUpdate=groupBy;
	}
	createGroups(){
		/*			INIT 			*/
		var projectCount = this.projects.length;
		var differentGroups = 0
		//count or set amount of differentGroups
		if(this.groupBy==="forschungsbereiche"){
			differentGroups = 4;
		} else if (this.groupBy==="geldgeber") {

			for (var i = 0; i < projectCount; i++) {
				if(this.groupByConfig[this.groupBy].text.indexOf(this.projects[i].geldgeber) === -1){
					this.groupByConfig[this.groupBy].text.push(this.projects[i].geldgeber);

					differentGroups++;
				}
			}
			var colorRange=d3.scaleLinear().domain([0,this.groupByConfig[this.groupBy].text.length])
        				  .range(['#666284','#b3b2bc', '#f0faf0']);
			for (var i = 0; i < this.groupByConfig[this.groupBy].text.length; i++) {
				this.groupByConfig[this.groupBy].color.push(colorRange(i));
			}
		}else if (this.groupBy==="kooperationspartner") {
			for (var i = 0; i < projectCount; i++) {
				if(this.groupByConfig[this.groupBy].text.indexOf(this.projects[i].kooperationspartner) === -1){
					this.groupByConfig[this.groupBy].text.push(this.projects[i].kooperationspartner);
					differentGroups++;
				}
			}
			var colorRange=d3.scaleLinear().domain([0,this.groupByConfig[this.groupBy].text.length])
        				  .range(['#666284','#b3b2bc', '#f0faf0']);
			for (var i = 0; i < this.groupByConfig[this.groupBy].text.length; i++) {
				this.groupByConfig[this.groupBy].color.push(colorRange(i));
			}
		}
		//create Basic groups-Array
		var tmpGroups =[];
		for (var i = 0; i < differentGroups; i++) {
			tmpGroups.push({
				text: 			this.groupByConfig[this.groupBy].text[i],
				count: 			0,
				percentage: 	0,
				percentageSum: 	0,
				color: 			this.groupByConfig[this.groupBy].color[i],
				projects: 		[],
				href: 			"",
				tooltip: 		""
			});
		}
		/*			SORT			*/
		for (var i = 0; i < projectCount; i++) {
			if(this.groupBy==="forschungsbereiche"){
				//counting the number of prjects
				tmpGroups[this.projects[i].forschungsbereich - 1].count++;
				var randomTitle = parseInt(Math.random()*(hrefGlobal[this.projects[i].forschungsbereich - 1].length));
				this.projects[i].href = hrefGlobal[this.projects[i].forschungsbereich - 1][randomTitle][1];
				this.projects[i].tooltip = hrefGlobal[this.projects[i].forschungsbereich - 1][randomTitle][0];
				tmpGroups[this.projects[i].forschungsbereich - 1].projects.push(this.projects[i]);

			} else if (this.groupBy==="geldgeber") {
				for (var j = 0; j < this.groupByConfig[this.groupBy].text.length; j++) {
					if (this.groupByConfig[this.groupBy].text[j] === this.projects[i].geldgeber){
						tmpGroups[j].count++;
						tmpGroups[j].projects.push(this.projects[i]);
						break;
					}
				}
			}else if (this.groupBy==="kooperationspartner") {
				for (var j = 0; j < this.groupByConfig[this.groupBy].text.length; j++) {
					if (this.groupByConfig[this.groupBy].text[j] === this.projects[i].kooperationspartner){
						tmpGroups[j].count++;
						tmpGroups[j].projects.push(this.projects[i]);
						break;
					}
				}
			}
		}

		/*			END 			*/
		for (var i = 0; i < differentGroups; i++) {
			//converting the number of Projects to a percentage
			tmpGroups[i].percentage = tmpGroups[i].count/projectCount;
		}
		var previousPercentSum = 0;
	    for (var i = 0; i < tmpGroups.length; i++) {
	    	previousPercentSum += tmpGroups[i].percentage;
	    	tmpGroups[i].percentageSum = previousPercentSum;
	    }
		return tmpGroups;
	}

}