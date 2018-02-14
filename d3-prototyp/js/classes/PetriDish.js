class PetriDish{
	/*
		Description
	*/

	constructor(svgId, data, type = "forschungsbereiche", config = {}) {
		/*
			Public
			updates all nessecary data and shows the Visulisation
				svgId - defines the SVG Id (e.g."#svgChart") where the Visulisation should be appended
				data  - the newProjects.json set or a subset of it
				type  - String defining the Visualisation Type
				config- Json with variables defining the Style properties
		*/
		this.pieChart = new PieChart(svgId,data,type,config);
		this.projectGraph = new ProjectGraph(svgId,data,type,config);
	}
	updateData(data){
		/*
			Public
			Updates The Visulisation with the new Data
				data - the newProjects.json set or a subset of it
		*/
		this.pieChart.updateData(data);
		this.projectGraph.updateData(data);
	}
	updateType(type){
		/*
			Public
			Changes how the data is displayed (e.g. different Values on the axises)
				type  - String defining the Visualisation Type
		*/
		//possibly a switch case which handles the different Types
		//this.pieChart.updateData(type);
		//NOT WORKING
	}
}
