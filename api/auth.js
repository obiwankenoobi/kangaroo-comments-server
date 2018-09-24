const express = require("express");
const router = express.Router();
const passport = require("passport");

// router.use();
router.get(
  "/",
  (req, res, next) => {
    let siteName = req.query.siteName;
    let pageName = req.query.pageName;
    console.log("siteName", siteName);
    return next();
  },
  passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/plus.login"]
  }),
  (req, res) => {
    console.log("this is profile", req.profile);
  }
);

module.exports = router;
