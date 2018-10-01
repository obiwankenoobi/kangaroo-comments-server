const express = require("express");
const router = express.Router();
const { Website } = require("../db/models/Website");
const fetchComments = require("./fetchCommentsFunc");

router.post("/", async (req, res) => {
  const {
    siteName, // the name of the site we want
    pageName // the name of the page
  } = req.body;
  res.send(await fetchComments(siteName, pageName)); // getting the response
});

module.exports = router;
