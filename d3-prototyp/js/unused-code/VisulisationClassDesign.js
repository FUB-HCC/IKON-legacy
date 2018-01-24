/*
	Class Design for all D3Visualisations of the current Prototype

	Decisions:
		Position and Size of the Visulisation
			Hardcodet change when nessecary
		Color and Style
			Defined in the css for each Visualisation
			unless they are generated Colors
		Data
			when calling this Visulisation it is unclear what data is needed, because this is different for all of them
			so it gets unprocessed data and needs to transform it for itself
		Different Visulisation Types(e.g. Petri Dish Forschungsbereiche-Geldgeber-...)
			(Change how the Data is displayed using the same Visualisation)
			Every Visulisation should have the Option for different types
			if it only has one it has only one
			Reason: I think it is easy to have different types of each Visualisation which would Display a whole new Perspective. Which is why I included this for all of them.
		Internal Class Structure
			It is unclear how the Structure might be for each Visualisation, but under suggestions I aggregated a few functions which seemed useful for all of them.
			Privacy displayed through underscore(_get()) before function as suggested here(https://stackoverflow.com/questions/27849064/how-to-implement-private-method-in-es6-class-with-traceur)
*/

class Visulisation{
	/*
		Description
	*/

	constructor(svgId, data, type) {
		/*
			Public
			Creates all nessecary data and shows the Visulisation
				svgId - defines the SVG Id (e.g."#svgChart") where the Visulisation should be appended
				data  - the newProjects.json set or a subset of it
				type  - String defining the Visualisation Type
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
	_createData(){
		/*
			Private
			Transforms the data in to a format which can be easily used for the Visulisation.

			(Possibly split up into a different function for each Visualisation type)
		*/
	}
	_createD3Elements(){
		/*
			Private
			Creates all nessecary D3 elements (e.g. ForceSimulation, Scales)

			(before createSvgElements() and variables Stored globally in this Class)
		*/
	}
	_createSvgElements(){
		/*
			Private
			Creates all nessecary SVG elements
		*/
	}



}
