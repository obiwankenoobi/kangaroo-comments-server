const express = require("express");
const router = express.Router();
const { Website } = require("../db/models/Website");
// const fetchComments = require("./fetchCommentsFunc");

// function to fetch comments from the db based on the name of site and page
function fetchComments(siteName, pageName, req, res) {
  let response; // response holder
  console.log("siteName", siteName);
  Website.findOne(
    {
      token: siteName
    },
    (e, site) => {
      // searching for the website
      if (e)
        // assiging error ro response if there is one
        req.send({
          error: e
        });
      if (site && site.pages.length > 0) {
        // if site found and there is already comments there
        let pagesArr = site.pages; // assign the pages array to var
        let pageObj = pagesArr.find(page => page.pageName == pageName); // grab the page we want from the array
        console.log("pageObj", pageObj);

        // cheking if there is a proper response (meaning if the pageName exist)
        // if not - set noSiteFound so the user could create a new one
        if (typeof pageObj != "object") {
          res.send("noSiteFound");
        } else {
          res.send(pageObj.comments); // grab the comments from the array
        }
      } else res.send("noSiteFound"); // if there is no site found assign msg to the response
    }
  );
}

router.post("/", async (req, res) => {
  const {
    siteName, // the name of the site we want
    pageName // the name of the page
  } = req.body;
  fetchComments(siteName, pageName, req, res); // getting the response
});

module.exports = router;
