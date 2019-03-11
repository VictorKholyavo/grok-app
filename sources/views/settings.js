import {JetView} from "webix-jet";
import {films} from "models/films";
import {categories} from "models/categories";

export default class ListView extends JetView {
	config() {
		const dataview = {
			cols: [
				{
					view:"dataview",
					localId: "dataview",
					template: (obj) => {
						let photo = "";
						if (!obj.photo) {
							photo = "<img class='defaultPhoto'>";
						}
						else {
							photo = "<img src ="+obj.photo+" class='smallPhoto'>";
						}
						return "<div class='columnSettings'>"+ photo +"</div><div class='columnSettings'><span>Title: " + obj.title + "</span></div><div class='columnSettings'><span>Year: " + obj.year + "</span></div>";
					},
					xCount:3,
					type:{
						width: 261,
						height: 90
					},
					select: true,
					on:{
						onAfterSelect: (id) => {
							this.setParam("id", id, true);
						}
					},
				},
				{
					rows: [
						{
							view: "form",
							localId: "formSettings",
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
										//	template: "#category#",
											data: categories,
										}
									},
								},
								{
									view: "button",
									localId: "updateButton",
									value: "Save",
									click: () => {
										const values = this.$getForm().getValues();
										let id = this.getParam("id", true);
										if (values && this.$getForm().validate()) {
											films.updateItem(id, values);
										}
									}
								},
							],
							rules: {
								rank: webix.rules.isNumber,
								year: webix.rules.isNumber,
								votes: webix.rules.isNumber,
								rating: webix.rules.isNumber,
								$all: webix.rules.isNotEmpty
							}
						},
						{
							view: "template",
							localId: "photo",
							name: "Photo",
							template: (obj)=> {
								let photo = "";
								if (obj.src) {
									photo = "<img class='photo' src="+obj.src+">";
								}
								return photo;
							},
						},
						{
							view:"uploader",
							localId:"uploader_1",
							value: "Upload file",
							upload: "http://localhost:3012/upload",
							accept:"image/png, image/gif, image/jpg",
							multiple: false,
							on: {
								onBeforeFileAdd:function(item){
									var type = item.type.toLowerCase();
									if (type != "jpg" && type != "png"){
										webix.message("Only PNG or JPG images are supported");
										return false;
									}
								},
								onFileUpload: (response)=>{
									let id = this.getParam("id", true);
									let values = films.getItem(id);
									values.photo = response.path;
									films.updateItem(id, values);
									this.$$("photo").setValues({src: response.path});
								}
							}
						},
					]
				},
			]
		};

		const categoriesDatatable = {
			rows: [
				{
					view:"datatable",
					localId: "datatableCategories",
					editable: true,
					columns: [
						{id:"value", header:"Category", editor: "text", fillspace:true, sort:"string"}
					],
					select: true,
				},
				{
					view: "button",
					type: "form",
					value: "Add",
					css: {
						float: "right"
					},
					click: () => {
						let value = {"value": "New category"};
						categories.add(value);
					},
				}
			]
		};

		return {
			view:"form",
			localId: "formFilm",
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
									view:"tabview",
									localId:"tabs",
									cells:[
										{ header: "Films", body: dataview },
										{ header: "Categories", body: categoriesDatatable }
									],
								},

							]
						}
					]
				}
			]
		};
	}
	$getDatatable(){
		return this.$$("datatableCategories");
	}
	$getDataView(){
		return this.$$("dataview");
	}
	$getForm() {
		return this.$$("formSettings");
	}
	init() {
		films.filter();
		this.$getDataView().sync(films);
		this.$getDatatable().sync(categories);
		let id = films.getFirstId();
		if (id) {
			this.setParam("id", id, true);
			this.$getDataView().select(id);
		}
	}
	urlChange() {
		let id = this.getParam("id", true ) || films.getFirstId();
		films.waitData.then(() => {
			const values = films.getItem(id);
			if (values) {
				this.$getForm().setValues(values);
				this.$$("photo").setValues({src: values.photo});
			}
		});
	}
}
