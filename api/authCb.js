const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get(
  "/",
  passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/plus.login"],
    failureRedirect: "/"
  }),
  (req, res, next) => {
    const { lastQuery } = req.session; // <== taking the query we asignied in /auth/google from req.session
    console.log("lastQuery", lastQuery);
    res.send({ user: req.user, lastQuery: lastQuery }); // sending full response with with the site name ans the user object
  }
);

module.exports = router;
