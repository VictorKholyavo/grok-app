export const categories = new webix.DataCollection({
	url: "http://localhost:3012/categories",
	save: "rest->http://localhost:3012/categories"
});
