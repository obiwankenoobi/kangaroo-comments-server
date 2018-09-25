const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get(
  "/",
  passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/plus.login"],
    failureRedirect: "/"
  }),
  (req, res) => {
    console.log(req.user);
    res.send(req.user);
  }
);

module.exports = router;
