const { Website } = require("../db/models/Website");

// function to fetch comments from the db based on the name of site and page
let fetchComments = async (siteName, pageName) => {
  let response; // response holder
  console.log("siteName", siteName);
  await Website.findOne(
    {
      token: siteName
    },
    (e, site) => {
      // searching for the website
      if (e)
        response = {
          error: e
        }; // assiging error ro response if there is one
      if (site && site.pages.length > 0) {
        // if site found and there is already comments there
        let pagesArr = site.pages; // assign the pages array to var
        let pageObj = pagesArr.find(page => page.pageName == pageName); // grab the page we want from the array
        console.log("pageObj", pageObj);

        // cheking if there is a proper response (meaning if the pageName exist)
        // if not - set noSiteFound so the user could create a new one
        if (typeof pageObj != "object") {
          response = "noSiteFound";
        } else {
          response = pageObj.comments; // grab the comments from the array
        }
      } else response = "noSiteFound"; // if there is no site found assign msg to the response
    }
  );
  console.log("response", response);
  return response;
};

module.exports = fetchComments;
