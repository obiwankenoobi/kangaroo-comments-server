const mongoose = require("mongoose");

const Comment = new mongoose.Schema();

Comment.add({
  // the name of the user who made the comment
  usernameWhoComment: {
    type: String
  },
  // not in use
  userImage: {
    type: String
  },
  // not in use
  dateAdded: {
    type: Date
  },
  // the id of the parent comment to reply on
  commentIdToReplyOn: {
    type: String
  },
  // not in use
  likes: {
    type: Array
  },
  // the id of the corrent comment
  commentId: {
    type: String
  },
  // not in use
  parent: {
    type: String
  },
  // the text of comment
  text: {
    type: String
  },
  // the data when the comment was added
  date: {
    type: Date
  },
  // string url with the user avatar from google
  userAvatar: {
    type: String
  },
  // array of comments with this schema
  comments: [Comment]
});

const PageSchema = mongoose.Schema({
  pageName: { type: String },
  id: { type: String },
  comments: [Comment]
});

const WebsiteSchema = mongoose.Schema({
  siteName: { type: String, unique: true },
  pages: [PageSchema],
  token: { type: String }
});

let Website = mongoose.model("website", WebsiteSchema);

module.exports = { Website, Comment };
