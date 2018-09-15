const express = require('express');
const router = express.Router();
const {
	Website
} = require('../db/models/Website');
const jwt = require('jsonwebtoken');
const config = require('../routes/config');


// fucntion to check if there is already website with a given name
// the call came from commentsPanel when the user trying to add new website
function checkIfWebsiteExist(req, res) {
	Website.findOne({
		siteName: req.body.websiteName
	}, (e, webSiteFound) => {

		if (e) res.send('error', e);

		// if there is no site with that name create a new one
		if (!webSiteFound) {

			const token = jwt.sign({
				websiteName: req.body.websiteName,
			}, config.JWTsecret, {});

			const newWebsite = new Website({
				siteName: req.body.websiteName, // assign the site name
				token: token
			});
			newWebsite.save((e, doc) => {
				if (e) res.send(e);
				else {
					res.send(doc);
				}
			});

		} else res.send('site exist');
	});
}



router.post('/', (req, res) => {
	checkIfWebsiteExist(req, res);
});

module.exports = router;