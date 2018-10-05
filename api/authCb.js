const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const config = require("../routes/config");

/**
 ** @ { function } getPageData - function to get all the user data we need to send back to the client
 */

function getPageData(req, res) {
  /**
   ** @ { object } lastQuery - the object with the query from url from req.app (we added it in /auth/google)
   ** @ { object } token - creating new access token to authenticate requests later on
   ** @ { object } pageData - all the data we need to pass back to client
   ** @ { object } io - instance of the IO connectiong we created, it added to <app> in /bin/www
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

  req.user.accessToken = token; // adding the token to the user object returned from google auth

  let pageData = {
    pageName: lastQuery.pageName, // ID for the page we send the data to
    siteName: lastQuery.siteName, // ID for the site we send the data to
    token: lastQuery.token, // token to identify the user who tried to login ( need because we using socket.io and need to identify each user so be send to the right client )
    user: req.user // the user auth object returned from google auth
  };

  // setting the page data in the router pbject to later access it in the io connection
  res.pageData = pageData;

  console.log(
    "socket.emit",
    `googleAuth-${res.pageData.siteName}-${res.pageData.pageName}-${
      res.pageData.token
    }`
  );

  const io = req.app.get("socketio");

  // emiting event with the strecture of <siteName-pageName-token>
  // which will be used to send the user object auth to the proper client based on that data
  io.sockets.emit(
    `googleAuth-${res.pageData.siteName}-${res.pageData.pageName}-${
      res.pageData.token
    }`,
    res.pageData
  );

  res.redirect("/authComplete.html");
  // res.send({
  //   user: req.user,
  //   pageData: res.pageData
  // }); // sending full response with with the site name ans the user object
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
