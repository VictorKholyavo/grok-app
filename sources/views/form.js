import {JetView} from "webix-jet";
import {categories} from "models/categories";

export default class FormView extends JetView {
	config() {
		const form = {
			view: "form",
			localId: "form",
			scroll: false,
			elements: [
				{
					view: "text",
					name: "rank",
					label: "Rank"
				},
				{
					view: "text",
					name: "title",
					label: "Title"
				},
				{
					view: "text",
					name: "year",
					label: "Year"
				},
				{
					view: "text",
					name: "votes",
					label: "Votes"
				},
				{
					view: "text",
					name: "rating",
					label: "Rating"
				},
				{
					view: "richselect",
					name: "categoryID",
					localId: "category",
					label: "Category",
					options: {
						body: {
							data: categories,
						}
					},

				},
				{
					cols: [
						{
							view: "button",
							localId: "updateButton",
							value: "Save",
							click: () => {
								const values = this.$getForm().getValues();
								this.onSubmit(values);
							}
						},
						{
							view: "button",
							localId: "closeButton",
							value: "Close",
							click: function () {
								this.getTopParentView().hide();
							}
						}
					]
				}
			],
			rules: {
				rank: webix.rules.isNumber,
				year: webix.rules.isNumber,
				votes: webix.rules.isNumber,
				rating: webix.rules.isNumber,
				$all: webix.rules.isNotEmpty
			}
		};

		return {
			view: "window",
			localId: "win2",
			width: 600,
			position: "center",
			modal: true,
			head: {
				template: " ",
				localId: "formTemplate"
			},
			body: form,
			on: {
				onHide: () => {
					this.$getForm().clear();
					this.$getForm().clearValidation();
				}
			}
		};
	}
	$getForm() {
		return this.$$("form");
	}
	showWindow(values, filled) {
		let formTemplate = this.$$("formTemplate");
		this.getRoot().show();
		if (values) {
			this.$getForm().setValues(values);
			formTemplate.define({template: "Edit film"});
		}
		else {
			formTemplate.define({template: "Add film"});
		}
		formTemplate.refresh();
		this.onSubmit = function(data) {
			if (this.$getForm().validate()) {
				filled(data);
			}
		};
	}
	init() {
	}

	hideOrNotHide() {
		webix.message("All is correct");
		this.$$("win2").hide();
	}
}
