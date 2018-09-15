const express = require('express');
const router = express.Router();
const fetchComments = require('./fetchCommentsFunc')

router.post('/', async (req, res) => {
    const {
        siteName, // the name of the site we want
        pageName // the name of the page
    } = req.body;
    const response = await fetchComments(siteName, pageName); // getting the response
    res.send(response) // sending the response
})

module.exports = router