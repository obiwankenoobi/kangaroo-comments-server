const express = require("express");
const router = express.Router();
const passport = require("passport");

// router.use();
router.get(
  "/",
  (req, res, next) => {
    let siteName = req.query.siteName;
    let pageName = req.query.pageName;

    req.session.lastQuery = req.query; // asigning the query params to the "req.session" object to later access it in the /auth/google/callback
    console.log("siteName", siteName);
    return next();
  },
  passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/plus.login"]
  })
);

module.exports = router;
