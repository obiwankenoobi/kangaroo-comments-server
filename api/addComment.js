const express = require('express');
const router = express.Router();
const {Website, Comment} = require('../db/models/Website');
const {helper} = require('../config');



function searchAndAddComment (
	siteFound, // the site obj we want to modify
	pageFound, // the page obj we want to modify 
	commentIdToReplyOn, // the ID of the comments we want to eply on
	usernameWhoComment, // the username who made the comment
	text, // the text of comment
	date, // the date the comment was generated
	save, // save function for the document (page.save)
	send, // send function (res.send)
	pageName // the page name we want to add the comment to
) {
	// working code
	if (pageFound.comments.length > 0) { // if the comments array in the page we found isnt empty
		pageFound.comments.map((comment) => { // mapping through the comments array in the page we want to modify
			if (comment.commentId == commentIdToReplyOn) { // if <commentId> in the indivitual comment object match <commentIdToReplyOn>
				// create new comment
				let newComment = {
					usernameWhoComment:usernameWhoComment,
					commentIdToReplyOn:commentIdToReplyOn,
					commentId:new Date().getTime(),
					text:text,
					date:date,
				};
				comment.comments.push(newComment); // pushing the comment to the comments array
				save(); // saving the doc
				send(); // sending response
			} 
			searchAndAddComment (
				siteFound, // the site obj we want to modify
				comment, // individual comment to rotate on
				commentIdToReplyOn, // the ID of the comments we want to eply on
				usernameWhoComment, // the username who made the comment
				text, // the text of comment
				date, // the date the comment was generated
				save, // send function (res.send)
				send, // send function (res.send)
				pageName // the page name we want to add the comment to
			);
		});
	}
}

function addRootComment (
	websiteFound, // website to use
	usernameWhoComment, // usename of the user who made the comment
	text, // the text of comment
	date, // date of comment
	save, // save functio 
	send, // send back function
	pageName // the page name we want to add the comment to
) {
	helper.alertD('addRootComment');

	// creating new comment
	let newComment = { 
		usernameWhoComment:usernameWhoComment,
		commentId:new Date().getTime(),
		text:text,
		date:date,
	};

	let pages = websiteFound.pages; // array of pages

	// pulling the object we neeed and assigning it to a value **because its array of objects you can directly modify it ans have the updated value in the original array**
	let pageToAddto = pages.filter((page) => page.pageName == pageName)[0]; 
	let pageCommentsToAddTo = pageToAddto.comments; // grabbing the comment array from the page object we grabbed above ^

	pageCommentsToAddTo.push(newComment); // pushing the root comment to the root page object

	save(); // save the doc
	send(); // send response
}



router.post('/', (req, res, next) => {

	const { 
		siteName , // the name of the site to modify
		pageName ,  // the name of the page to modify
		commentIdToReplyOn , // the ID of the comment to reply on
		usernameWhoComment , // the username of the user who made the comment
		text , // the text of comment 
		date
	} = req.body;

	helper.alertD (
		siteName , 
		pageName , 
		commentIdToReplyOn
	);

	Website.findOne({
		token:siteName, // search website doc by the name given
	}, (e , siteFound) => {

		if (e) res.send({error:e});

		else if (!siteFound) { // if there is no site with that name
			// console.log('!siteFound');
			// // create new site
			// const newWebsite = new Website({
			// 	siteName:siteName, // assign the site name
			// 	pages:[{
			// 		pageName:pageName,
			// 		id: `${pageName}-${new Date().getTime()}`
			// 	}] // create a page using the name provided and push it to array
			// });
			// newWebsite.save((e, website) => { // save the new website
			// 	if (e) {
			// 		console.log('e',e);
			// 		res.send({error:e});
			// 	}
			// 	if (website) { // if it saved
			// 		console.log('saved');
			// 		Website.findOne({ // search for the website
			// 			siteName:siteName,
			// 		}, 
			// 		(e , websiteFound) => { 
			// 			if (e) res.send({error:e});
			// 			if (websiteFound) { // if it found the website with the givven name
			// 				helper.alertD(websiteFound);

			// 				// add comment
			// 				addRootComment (
			// 					websiteFound, // object of the site wewant to modify
			// 					usernameWhoComment, // the username of the user who made the comment
			// 					text, // the comment text
			// 					date, // the date of comment
			// 					() => websiteFound.save(), // passing the save method
			// 					() => res.send(newWebsite), // sending response function
			// 					pageName // the page name to modify
			// 				);
			// 			}
			// 		});
			// 	}
			// });
			console.log('invoked noSiteFound')
			res.send('noSiteFound');
		}
		else if (siteFound) { // if there is site with that name
			console.log('siteFound');

			let pagesArr = siteFound.pages; // assign the pages array

			// assiging the page we found **because its array of objects you can directly modify it ans have the updated value in the original array**
			let pageFound = pagesArr.filter((item) => item.pageName == pageName)[0]; 

			if (pageFound) { // if there is page with that name
				commentIdToReplyOn ? // if there is <commentIdToReplyOn> means comment on comment
					searchAndAddComment (
						siteFound, // object of the site wewant to modify
						pageFound, // object of the page we want to modify
						commentIdToReplyOn , // the id of the comment to reply on
						usernameWhoComment , // the username of the user who made the comment
						text , // the comment text
						date , // the date of comment
						() => siteFound.save((e, saved) => { // saving doc function 
							if (saved) helper.alertD('new comment saved');
						}) ,// passing the save method
						() => res.send('comment saved'), // sending response function
						pageName // the name of the page to modify
					) 
					: // if there isnt <commentIdToReplyOn> means comment on roor
					addRootComment (
						siteFound, // object of the site wewant to modify
						usernameWhoComment, // object of the page we want to modify
						text, // the comment text
						date , // the date of comment
						() => siteFound.save((e, saved) => { // saving doc function 
							if (saved) helper.alertD('new comment on root');
						}),
						() => res.send('comment saved'), // sending response function
						pageName // the name of the page to modify
					);
			} else { // if there isnt page with that name
				console.log('else')
				// create new page
				let newPage = {
					pageName:pageName,
					id: `${pageName}-${new Date().getTime()}`
				};

				pagesArr.push(newPage); // push page to the array of pages
				addRootComment (
					siteFound, // object of the site wewant to modify
					usernameWhoComment, // object of the page we want to modify
					text, // the comment text
					date , // the date of comment
					() => siteFound.save((e, saved) => { // saving doc function 
						if (saved) helper.alertD('new comment on root');
					}),
					() => res.send('comment saved'), // sending response function
					pageName // the name of the page to modify
				);
			}
		}
	});
});

module.exports = router;
