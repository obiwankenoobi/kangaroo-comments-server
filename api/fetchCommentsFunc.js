const { Website } = require("../db/models/Website");

// function to fetch comments from the db based on the name of site and page
let fetchComments = async (siteName, pageName) => {
  console.log("siteName", siteName);
  let promiseForCommentsOrError = () =>
    new Promise(resolve => {
      Website.findOne(
        {
          token: siteName
        },
        (e, site) => {
          // assiging error ro response if there is one
          if (e)
            resolve({
              error: e
            });
          // if site found and there is already comments there
          if (site && site.pages.length > 0) {
            let pagesArr = site.pages; // assign the pages array to var
            let pageObj = pagesArr.find(page => page.pageName == pageName); // grab the page we want from the array
            console.log("pageObj", pageObj);

            // checking if there is a proper response (meaning if the pageName exist)
            // if not - set noSiteFound so the user could create a new one
            if (typeof pageObj != "object") {
              resolve("noSiteFound");
            } else {
              resolve(pageObj.comments); // grab the comments from the array
            }
          } else resolve("noSiteFound"); // if there is no site found assign msg to the response
        }
      );
    });

  return await promiseForCommentsOrError();
};

module.exports = fetchComments;
