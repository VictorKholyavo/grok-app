export const categories = new webix.DataCollection({
	url: "http://localhost:3012/categories",
	save: "rest->http://localhost:3012/categories",
	scheme: {
		$init: function(obj){
			obj.value = obj.category
		},
	}
});


//	{ id:1, category:"Action"},
//	{ id:3, category:"Horror"},
//	{ id:6, category:"Thriller"}
