const mongoose = require('mongoose');

const Comment = new mongoose.Schema();


Comment.add({
	usernameWhoComment: {
		type: String
	},
	userImage: {
		type: String
	},
	dateAdded: {
		type: {
			Date
		}
	},
	commentIdToReplyOn: {
		type: String
	},
	likes: {
		type: Array
	},
	commentId: {
		type: String
	},
	parent: {
		type: String
	},
	text: {
		type: String
	},
	date: {
		type: Date
	},
	comments: [Comment]
});

const PageSchema = mongoose.Schema({
	pageName: {type:String},
	id: {type:String},
	comments: [Comment]
});

const WebsiteSchema = mongoose.Schema({
	siteName: {type:String, unique: true},
	pages:[PageSchema],
	token: {type:String}
});

let Website = mongoose.model('website', WebsiteSchema);

module.exports = {Website , Comment};