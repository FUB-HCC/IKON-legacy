class NewProjectGraph{
	/*
		Description
	*/

	constructor(svgId, data, type = "default", config = {}) {
		/*
			Public
			updates all nessecary data and shows the Visulisation
				svgId - defines the SVG Id (e.g."#svgChart") where the Visulisation should be appended
				data  - the newProjects.json set or a subset of it
				type  - String defining the Visualisation Type
				config- Json with variables defining the Style properties
		*/
	}
	updateData(data){
		/*
			Public
			Updates The Visulisation with the new Data
				data - the newProjects.json set or a subset of it
		*/
	}
	updateType(type){
		/*
			Public
			Changes how the data is displayed (e.g. different Values on the axises)
				type  - String defining the Visualisation Type
		*/
		//possibly a switch case which handles the different Types
	}

	_processData(inData){
		/*
			Private
			Transforms the data in to a format which can be easily used for the Visulisation.
				inData - the newProjects.json set or a subset of it

				Returns the processed data.

		*/
		//Possibly split up into a different functions for each Visualisation type
		return result;
	}
	_updateD3Functions(){
		/*
			Private
			Updates all nessecary D3 funcitons (e.g. ForceSimulation, Scales)
		*/
	}
	_updateSvgElements(){
		/*
			Private
			Updates all nessecary SVG elements
		*/
	}



}
