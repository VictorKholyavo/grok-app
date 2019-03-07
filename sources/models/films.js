export const films = new webix.DataCollection({
	url: "http://localhost:3012/films",
	save: {
		url: "rest->http://localhost:3012/films",
		updateFromResponse: true
	}
});
films.refresh = function() {
	this.clearAll();
	this.load(this.config.url);
};
