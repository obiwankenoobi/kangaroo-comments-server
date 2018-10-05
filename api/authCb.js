const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const config = require("../routes/config");

// function to get user data from the query and set it into res.pageData to send it to the client
function getPageData(req, res) {
  /**
   ** getting the lastQuery object from req.app (we added it in /auth/google)
   **/
  const lastQuery = req.app.get("lastQuery");

  // creating access token
  const token = jwt.sign(
    {
      pageName: lastQuery.pageName,
      siteName: lastQuery.siteName,
      token: lastQuery.token,
      user: req.user
    },
    config.JWTsecret,
    {}
  );

  req.user.accessToken = token;

  // getting the page data and assigning it to an object
  let pageData = {
    pageName: lastQuery.pageName,
    siteName: lastQuery.siteName,
    token: lastQuery.token,
    user: req.user
  };

  // setting the page data in the router pbject to later access it in the io connection
  res.pageData = pageData;
  console.log(
    "socket.emit",
    `googleAuth-${res.pageData.siteName}-${res.pageData.pageName}-${
      res.pageData.token
    }`
  );
  // calling the io instance that we set in the io initialization in /bin/www
  const io = req.app.get("socketio");

  // emiting event with the strecture of <siteName-pageName-token>
  // which will be used to send the user object auth to the proper client based on that data
  io.sockets.emit(
    `googleAuth-${res.pageData.siteName}-${res.pageData.pageName}-${
      res.pageData.token
    }`,
    res.pageData
  );

  // res.redirect("/authComplete.html");
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
