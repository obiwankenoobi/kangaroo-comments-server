const jwt = require("jsonwebtoken");
const config = require("../routes/config");

function authMiddleWare(req, res, next) {
  //let token = req.body.token; // taking the token we passed in the request
  if (!req.headers.authorization)
    return res.status(401).send({ auth: false, message: "No token provided." }); // send 401 if there is no token provided

  jwt.verify(req.headers.authorization, config.JWTsecret, (err, decoded) => {
    // using the token we passed to authonticate the account
    if (err)
      return res
        .status(401)
        .send({ auth: false, message: "Failed to authenticate token." }); // if the token wrong send 401 status

    next();
  });
}

module.exports = authMiddleWare;
