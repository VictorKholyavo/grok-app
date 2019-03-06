export const films = new webix.DataCollection({
	url: "http://localhost:3012/films",
	save: "rest->http://localhost:3012/films",
});
films.refresh = function() {
	this.clearAll();
	this.load(this.config.url);
};
