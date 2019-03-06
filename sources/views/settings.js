import {JetView} from "webix-jet";
import {films} from "models/films";
import {categories} from "models/categories";

export default class ListView extends JetView {
	config() {
		return {
			view:"form",
			localId: "formContact",
			borderless:true,
			autoheight: false,
			elements: [
				{
					rows: [
						{
							view: "template",
							template: "Settings",
							localId: "formTemplate",
							css: "formTemplate",
							height: 40
						},
						{
							cols: [
								{
									view:"dataview",
									localId: "dataview",
							    template:"<div class='webix_strong'>#title#</div> Year: #year#, rank: #rank#",
							  //  data:,
							   	xCount:3, //the number of items in a row
							  //  yCount:4, //the number of items in a column
							    type:{
							        width: 261,
							        height: 90
							    }
								},
								{

								}
							]
						}
					]
				}
			]
		};
	}
	$getDataView(){
		return this.$$("dataview");
	}
	init() {
		films.filter();
		this.$getDataView().sync(films)
	}
}
