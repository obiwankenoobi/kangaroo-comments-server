const express = require('express');
const router = express.Router();
const passport = require('passport');
const axios = require('axios');
const config = require('./config');

// async function faceBookAuth() {
// 	return await axios.get(`${config.server}/login/facebook`);
// }

// router.post('/', (req, res) => {
//     //res.redirect('/login/facebook')
//     faceBookAuth()
//     .then((response) => {
//         res.send(response.data)
//     })
// });

router.get('/facebook',
	passport.authenticate('facebook'));

router.get('/facebook/return', 
	passport.authenticate('facebook', { failureRedirect: '/login' }),
	(req, res) => {
		res.send(req.user);
	});
    
module.exports = router;