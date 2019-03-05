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
					css: "webix_header webix_dark",
					cols: [
						{
							view: "button",
							type: "form",
							value: "Export to Excel",
							width: 200,
							css: {
								float: "right"
							},
							click: () => {
								webix.toExcel(this.$getDatatable());
							}
						},
						{
							view: "button",
							type: "form",
							value: "Refresh",
							width: 200,
							css: {
								float: "right"
							},
							click: () => {
								const datatable = this.$$("datasetA");
								films.clearAll();
								films.load("http://localhost:3012/films");
								datatable.showProgress({
									type: "bottom",
									delay: 100,
									hide: true
								});
								// setTimeout(function () {
								// 	datatable.parse(films);
								// }, 1000);
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
						}
					},
					on: {
						onItemClick: (id) => {
							let values = films.getItem(id);
							this.formForFilms.showWindow(values);
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
						this.formForFilms.showWindow();
					}
				}
			]
		};
	}
	init() {
		this.$$("datasetA").sync(films);
		films.filter();
		this.formForFilms = this.ui(FormView);
		webix.extend(this.$$("datasetA"), webix.ProgressBar);
	}
	$getDatatable() {
		return this.$$("datasetA");
	}
}
