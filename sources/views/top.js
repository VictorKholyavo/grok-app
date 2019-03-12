import {JetView, plugins} from "webix-jet";

export default class TopView extends JetView {
	config() {
		const header = {
			type: "header", template: this.app.config.name, css: "webix_header app_header"
		};

		const menu = {
			view: "menu",
			id: "top:menu",
			css: "app_menu",
			width: 180,
			layout: "y",
			select: true,
			template: "<span class='webix_icon #icon#'></span> #value# ",
			data: [
				{value: "Dataset A", id: "datasetA", icon: "wxi-columns"},
				{value: "Dataset B", id: "datasetB", icon: "wxi-columns"},
				{value: "List", id: "list", icon: "wxi-pencil"},
				{value: "Settings", id: "settings", icon: "wxi-pencil"}
			],
			on: {
				onAfterSelect:function(id){
					const header = this.$scope.$$("header");
					header.define({template: this.getItem(id).value});
					header.refresh();
				},
			},
		};

		const ui = {
			type: "clean",
			paddingX: 5,
			css: "app_layout",
			rows: [
				{
					paddingX: 5,
					paddingY: 10,
					rows: [
						{
							type: "header",
							view: "template",
							value: "#value#",
							localId: "header",
							css: "webix_dark mainHeader"
						},
						{
							css: "webix_shadow_medium",
							cols: [
								menu,
								{ $subview:true }
							]
						}
					]
				},
				{
					type: "wide",
					paddingY: 10,
					paddingX: 5,
					rows: []
				}
			]
		};
		return ui;
	}
	init() {
		this.use(plugins.Menu, "top:menu");
	}
}
