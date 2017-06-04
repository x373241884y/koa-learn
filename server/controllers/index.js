exports.index = function () {
	return {
		url: "/",
		controller: async function (ctx, next) {
			await ctx.render('index',{title:'test index... '});
		}
	}
};