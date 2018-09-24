const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const RateLimit = require("express-rate-limit");
const cors = require("cors");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const config = require("./routes/config");

// mongo imports
const mongodb = require("mongodb");
const MongoClient = require("mongodb").MongoClient;
const { mongoose } = require("./db/mongoose");

// routes
const index = require("./routes/index");
const users = require("./routes/users");

const app = express();
//app.io = require('socket.io')();

//api
const addComment = require("./api/addComment");
const fetchComments = require("./api/fetchComments");
const checkWebsite = require("./api/checkWebsite");
const auth = require("./api/auth");
const authCb = require("./api/authCb");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3011/auth/google/callback"
    },
    (accessToken, refreshToken, profile, done) => {
      console.log("this is user google", profile);
      done(null, false);
      return profile;
    }
  )
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

let limiter = new RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  delayMs: 0 // disable delaying - full speed until the max limit is reached
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(limiter);

// routes
app.use("/", index);
app.use("/users", users);

//api
app.use("/addcomment", addComment);
app.use("/fetchcomments", fetchComments);
app.use("/checkwebsite", checkWebsite);
app.use("/auth/google", auth);
app.use("/auth/google/callback", authCb);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
