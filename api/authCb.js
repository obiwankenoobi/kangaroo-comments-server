const express = require("express");
const router = express.Router();
const passport = require("passport");

// function to get user data from the query and set it into res.pageData to send it to the client
function getPageData(req, res) {
  const { lastQuery } = req.session; // <== taking the query we asignied in /auth/google from req.session
  console.log("lastQuery", lastQuery);

  // getting the page data and assigning it to an object
  let pageData = {
    pageName: lastQuery.pageName,
    siteName: lastQuery.siteName,
    token: lastQuery.token
  };

  // setting the page data in the router pbject to later access it in the io connection
  res.pageData = pageData;

  // calling the io instance that we set in the io initialization in /bin/www
  const io = req.app.get("socketio");

  // emiting event with the strecture of <siteName-pageName-token>
  // which will be userd to send the user google auth to the proper client
  io.sockets.emit(
    `${res.pageData.siteName}-${res.pageData.pageName}-${res.pageData.token}`,
    res.pageData
  );

  res.send({
    user: req.user,
    pageData: res.pageData
  }); // sending full response with with the site name ans the user object
}
// a wraper to the router so i could get access to the io server

router.get(
  "/",
  passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/plus.login"],
    failureRedirect: "/"
  }),
  (req, res) => {
    getPageData(req, res);
  }
);

module.exports = router;
