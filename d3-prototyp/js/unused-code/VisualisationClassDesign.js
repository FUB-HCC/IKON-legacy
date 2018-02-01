/*
	Class Design for all D3Visualisations of the current Prototype

	Decisions:
		Style
			defined in Css
			Additional option in the constructor config variable
		Colors defined Globally
			currently var colors. It can be changed to a Class which loads it from a json file or changes it dynamically
			or can be changed to use only colors from the css
		Data
			Each Class gets the projectsJson and has to process it on its own because its very often
			different
		Different Visulisation Types(e.g. Petri Dish Forschungsbereiche-Geldgeber-...)
			Every Visulisation should have the Option for different types
			Reason:
				I think it is easy to have different types for each Visualisation. Each giving a different Perspective
		Internal Class Structure
			It is unclear how the Structure might be for each Visualisation, but under suggestions I aggregated a few functions which seemed useful for all of them.
			Privacy displayed through underscore(_get()) before function as suggested here(https://stackoverflow.com/questions/27849064/how-to-implement-private-method-in-es6-class-with-traceur)
*/

class Visualisation{
	/*
		Description
	*/

	constructor(svgId, data, type, config = {}) {
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

	/*--------Suggestions--------*/
	_processData(inData){
		/*
			Private
			Transforms the data in to a format which can be easily used for the Visulisation.
				inData - the newProjects.json set or a subset of it

				Returns the processed data.
			(Possibly split up into a different function for each Visualisation type)
		*/
		return result;
	}
	_updateD3Elements(){
		/*
			Private
			Updates all nessecary D3 elements (e.g. ForceSimulation, Scales)
		*/
	}
	_updateSvgElements(){
		/*
			Private
			Updates all nessecary SVG elements
			(split into separate functions when too large)
		*/
	}



}
