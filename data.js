var data = {};
var fs = require('fs');

var fileContent =  "";
try {
	fileContent = JSON.parse(fs.readFileSync('./data.json'));
} catch (e) {
	console.log("Error parsing data.json");
}



data.lastDevBlog = {
	title : ((fileContent === "") ? "" : fileContent.lastDevBlog.title)
};
data.lastPatchNotes = {
	title : (fileContent === "") ? "" : fileContent.lastPatchNotes.title
};
data.lastEveNews = {
	title : (fileContent === "") ? "" : fileContent.lastEveNews.title
};
data.lastYtLink = (fileContent === "") ? "" : fileContent.lastYtLink


module.exports = data;

module.exports.setDev = function(title) {
	data.lastDevBlog.title = title;
}
module.exports.setPatch = function(title) {
	data.lastPatchNotes.title = title;
}
module.exports.setNews = function(title) {
	data.lastEveNews.title = title;
}
module.exports.setYt = function(link) {
	data.lastYtLink.title = link;
}