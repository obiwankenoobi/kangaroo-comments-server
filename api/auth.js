const express = require("express");
const router = express.Router();
const passport = require("passport");

// router.use();
router.get(
  "/",
  (req, res, next) => {
    /**
     ** setting the lastQuery object in the global scope of app
     ** to use later in /auth/google/callback
     ** we have access to <app> through req.app because we added it in /bin/www
     **/
    const app = req.app.get("app");
    app.set("lastQuery", req.query);
    return next();
  },
  passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/plus.login"]
  })
);

module.exports = router;
