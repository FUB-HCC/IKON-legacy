//COLOR RANGE EXAMPLE
/*
	    this.colorRange=d3.scaleLinear().domain([min,max])
        				  .range(['#b3b2bc', '#f0faf0']);
*/
class Network {
	constructor(projects) {
		this.projects=projects;
		this.groupBy = "forschungsbereiche";//forschungsbereiche kooperationspartner geldgeber
		this.groupByConfig = {
			forschungsbereiche:{
				text:["Forschungsbereich 1","Forschungsbereich 2","Forschungsbereich 3","Forschungsbereich 4"],
				color:["#985152","#7d913c","#8184a7","#d9ef36"]
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
	    this.radialChart = new RadialChart(this.groups);
	    this.projectGraph = new ProjectGraph(this.groups);
		this.animationTime = 2000;
		this.isOpen=false;
	}
	changeVisualisation(groupBy){

		var that = this;
		if(this.isOpen){
			this.radialChart.fadeOut(this.animationTime);
			this.projectGraph.fadeOut(this.animationTime);
			setTimeout(function() {
				that.isOpen=false;
				that.changeVisualisation(groupBy);
			}, this.animationTime);
		}else{
			this.groupBy = groupBy;
			this.groups = this.createGroups();
			this.radialChart.changeData(this.groups);
			this.radialChart.fadeIn(this.animationTime);
			this.isOpen=true;
			//TODO
			setTimeout(function() {
				that.projectGraph.changeData(that.groups);
				that.projectGraph.fadeIn(that.animationTime);
			}, this.animationTime/1.5);

		}

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
					this.groupByConfig[this.groupBy].color.push(getRandomColor());
					differentGroups++;
				}
			}
		}else if (this.groupBy==="kooperationspartner") {
			for (var i = 0; i < projectCount; i++) {
				if(this.groupByConfig[this.groupBy].text.indexOf(this.projects[i].kooperationspartner) === -1){
					this.groupByConfig[this.groupBy].text.push(this.projects[i].kooperationspartner);
					this.groupByConfig[this.groupBy].color.push(getRandomColor());
					differentGroups++;
				}
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
				projects: 		[]
			});
		}
		/*			SORT			*/
		for (var i = 0; i < projectCount; i++) {
			if(this.groupBy==="forschungsbereiche"){
				//counting the number of prjects
				tmpGroups[this.projects[i].forschungsbereich - 1].count++;
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
	    console.log(tmpGroups);
		return tmpGroups;
	}

}