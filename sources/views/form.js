import {JetView} from "webix-jet";
import {films} from "models/films";

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
					cols: [
						{
							view: "button",
							localId: "updateButton",
							value: "Save",
							click: () => { this.addOrSave(); }
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
					this.$$("form").clear();
					this.$$("form").clearValidation();
				}
			}
		};
	}
	showWindow(values) {
		let form = this.$$("form");
		let formTemplate = this.$$("formTemplate");

		this.getRoot().show();
		if (values) {
			films.waitData.then(() => {
				form.setValues(values);
			});
			formTemplate.define({template: "Edit film"});
		}

		else {
			formTemplate.define({template: "Add film"});
		}
	}
	init() {
	}
	addOrSave() {
		if (this.$$("form").validate()) {

			const filled = this.$$("form").getValues();
			if (filled.id) {
				films.updateItem(filled.id, filled);
			}
			else {
				films.add(filled);
			}
			webix.message("All is correct");
			this.$$("win2").hide();
		}
		else {
			webix.message({type: "error", text: "Form data is invalid"});
		}
	}
}
