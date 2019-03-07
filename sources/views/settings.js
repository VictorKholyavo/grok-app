import {JetView} from "webix-jet";
import {films} from "models/films";

export default class ListView extends JetView {
	config() {
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
									view:"dataview",
									localId: "dataview",
									template: (obj) => {
										return "<div class='columnSettings'></div><div class='columnSettings'><span>Title: " + obj.title + "</span></div><div class='columnSettings'><span>Year: " + obj.year + "</span></div>";
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
										{},
										{
											view:"uploader",
											localId:"uploader_1",
											value: "Upload file",
											name: "photo",
											upload: films,
											autosend: false,
											on: {
												onBeforeFileAdd: (upload) => {
													let id = this.getParam("id", true);
													var file = upload.file;
													var reader = new FileReader();
													reader.onload = (event) => {
														const values = films.getItem(id);
														values.photo = event.target.result;
														films.updateItem(id, values);
														this.$$("photo").setValues({src: event.target.result});
													};
													reader.readAsDataURL(file);
													return false;
												}
												// onAfterFileAdd: (file) => {
												// 	let id = this.getParam("id", true);
												// 	let values = films.getItem(id);
												// 	console.log(id);
												// 	console.log(values);
												// 	values.photo = file;
												// 	films.updateItem(id, values);
												// 	// file.ContactID = id;
												// 	// files.add(file);
											}
										}
									]
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
										else {
											photo = "<img class='defaultPhotoBig'>";
										}
										return photo;
									},
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
		this.$getDataView().sync(films);
	}
	urlChange() {
		let id = this.getParam("id", true );
		films.waitData.then(() => {
			const values = films.getItem(id);
			this.$$("photo").setValues({src: values.photo});
		});
	}
}
