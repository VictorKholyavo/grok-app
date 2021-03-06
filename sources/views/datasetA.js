import {JetView} from "webix-jet";
import {films} from "models/films";
import FormView from "./form";

function likeCompare(value, filter) {
	value = value.toString().toLowerCase();
	filter = filter.toString().toLowerCase();
	return value.indexOf(filter) !== -1;
}

export default class ListView extends JetView {
	config() {
		return {
			rows: [
				{
					view: "toolbar",
					elements: [
						{},
						{
							view: "button",
							type: "form",
							value: "Export to Excel",
							autowidth: true,
							click: () => {
								webix.toExcel(this.$getDatatable());
							}
						},
						{
							view: "button",
							type: "form",
							value: "Refresh",
							autowidth: true,
							click: () => {
								films.refresh();
							}
						}
					]
				},
				{
					view: "datatable",
					localId: "datasetA",
					css: "webix_shadow_medium",
					select: true,
					columns: [
						{id: "rank", header: "", width: 50, css: "rank", sort: "int"},
						{id: "title", header: ["Title", {content: "textFilter", compare: likeCompare}], fillspace: true, sort: "string"},
						{id: "year", sort: "int", header: ["Released", {content: "numberFilter"}]},
						{id: "votes", header: ["Votes", {content: "numberFilter"}], sort: "int"},
						{id: "rating", header: ["Rating", {content: "numberFilter"}], sort: "int"},
						{id: "del", header: "", template: "{common.trashIcon()}"}
					],
					onClick: {
						"wxi-trash": (e, id) => {
							if (id) {
								films.remove(id.row);
							}
							return false;
						}
					},
					on: {
						onItemClick: (id) => {
							const form = this.formForFilms;
							let values = films.getItem(id.row);
							this.formForFilms.showWindow(values, function(data) {
								films.updateItem(data.id, data);
								form.hideOrNotHide();
							});
						}
					}
				},
				{
					view: "button",
					type: "form",
					value: "Add",
					css: {
						float: "right"
					},
					click: () => {
						const form = this.formForFilms;
						this.formForFilms.showWindow("", function(data) {
							films.add(data);
							form.hideOrNotHide();
						});
					}
				}
			]
		};
	}
	init() {
		this.$getDatatable().sync(films);
		this.formForFilms = this.ui(FormView);
		webix.extend(this.$getDatatable(), webix.ProgressBar);
	}
	$getDatatable() {
		return this.$$("datasetA");
	}
}
