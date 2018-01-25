/*
	Class Design for all D3Visualisations of the current Prototype

	Decisions:
		Position and Size of the Visulisation
			Hardcodet change when nessecary
		Style
			Css could be used´but it would struggle with the generated data of different size
				(e.g. unkown amount of different Kooperationpartners and more specific things like Arc width)
			Instead config json which defines theses things with a default one set
				more for future use if it should be modified for different scenarios
		Colors defined Globally
			currently var colors. It can be changed to a Class which loads it from a json file or changes it dynamically
			or can be changed to use only colors from the css
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

	If funcitons can have predifined values. It might be useful to have a config json which could be used to define color width etc. instead of css
	this is better because a lot more can be defined here but less seperation between code and display.
*/

class Visualisation{
	/*
		Description
	*/

	constructor(svgId, data, type, config = {}) {
		/*
			Public
			Creates all nessecary data and shows the Visulisation
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

				After 	_createData()
				Before 	_createSvgElements()
		*/
	}
	_createSvgElements(){
		/*
			Private
			Creates all nessecary SVG elements
			split into separate functions when too large
		*/
	}



}
