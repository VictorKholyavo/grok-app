import {JetView} from "webix-jet";
import {films} from "models/films";
import {categories} from "models/categories";

export default class ListView extends JetView{
	config(){
		return {
			cols: [
				{
					view:"list",
					localId:"list",
					width: 400,
					select: true,
					template: "#value#",
					css:"webix_shadow_medium",
					on:{
						onAfterSelect: (category) => {
							this.setParam("category", category, true);
						}
					},
				},
				{
					view:"datatable",
					localId: "datatable",
					select: true,
					css:"webix_shadow_medium",
					columns: [
						{id:"rank", header:"", width: 50, css: "rank", sort:"int"},
						{id:"title", editor: "text", header:"Title", fillspace:true, sort:"string"},
						{id:"year",  sort:"int", header:"Released"},
						{id:"votes",  header:"Votes", sort:"int"},
						{id:"rating", header:"Rating", sort:"int"},
					],
					on:{
						onAfterSelect: (id) => {
							this.setParam("film", id, true);
						}
					},

				},
				{
					view: "template",
					localId: "detailedInfo",
					template:(obj) => {
						let category = "No category";
						if (obj && categories.getItem(obj.categoryID)) {
							category = categories.getItem(obj.categoryID).value;
						}
						return "<div><span>Film Detailed Info:</span><br></div><div><span class='templateRow'>Title: " + obj.title + "</span><span class='templateRow'>Year: " + obj.year + "</span><span class='templateRow'>Votes: " + obj.votes + "</span><span class='templateRow'>Rating: " + obj.rating + "</span><span>Category: " + category + "</span></div>";
					}
				}
			]
		};
	}
	$getList() {
		return this.$$("list");
	}
	$getDatatable() {
		return this.$$("datatable");
	}
	init(){
		this.$getList().sync(categories);
		this.$getDatatable().sync(films);
	}
	urlChange(){
		const template = this.$$("detailedInfo");

		let categoryId = this.getParam("category") || categories.getFirstId();

		let film = this.getParam("film") || films.getFirstId();
		let values = films.getItem(film) || films.getItem(films.getFirstId());
		let categoryValue = categories.getItem(categoryId) || categories.getItem(categories.getFirstId());

		if (values) {
			template.parse(values);
		}

		if (!categoryId) {
			return films.filter();
		}
		films.filter(
			function(obj){
				return obj.categoryID == categoryValue.id;
			}
		);
	}
}
