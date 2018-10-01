const express = require("express");
const router = express.Router();
const { Website } = require("../db/models/Website");

const { helper } = require("../config");

function searchAndAddComment(
  siteFound, // the site obj we want to modify
  pageFound, // the page obj we want to modify
  commentIdToReplyOn, // the ID of the comments we want to eply on
  usernameWhoComment, // the username who made the comment
  text, // the text of comment
  date, // the date the comment was generated
  save, // save function for the document (page.save)
  //send, // send function (res.send)
  pageName, // the page name we want to add the comment to
  userAvatar // the user avatar
) {
  // checking the string meet the rules
  if (
    !usernameWhoComment ||
    //usernameWhoComment.length < 5 ||
    //usernameWhoComment.length > 15 ||
    text.length < 5 ||
    text.length > 1000
  ) {
    helper.alertD("name must be 5-15 chars long - text must be 5-1000 chars");
  } else {
    // working code
    if (pageFound.comments.length > 0) {
      // if the comments array in the page we found isnt empty
      pageFound.comments.map(comment => {
        // mapping through the comments array in the page we want to modify
        if (comment.commentId == commentIdToReplyOn) {
          // if <commentId> in the indivitual comment object match <commentIdToReplyOn>
          // create new comment
          let newComment = {
            usernameWhoComment: usernameWhoComment,
            commentIdToReplyOn: commentIdToReplyOn,
            commentId: new Date().getTime(),
            text: text,
            date: date,
            userAvatar: userAvatar
          };
          comment.comments.push(newComment); // pushing the comment to the comments array
          save(); // saving the doc
          //send(); // sending response
        }
        searchAndAddComment(
          siteFound, // the site obj we want to modify
          comment, // individual comment to rotate on
          commentIdToReplyOn, // the ID of the comments we want to eply on
          usernameWhoComment, // the username who made the comment
          text, // the text of comment
          date, // the date the comment was generated
          save, // send function (res.send)
          //send, // send function (res.send)
          pageName, // the page name we want to add the comment to
          userAvatar // the user avatar
        );
      });
    }
  }
}

function addRootComment(
  websiteFound, // website to use
  usernameWhoComment, // usename of the user who made the comment
  text, // the text of comment
  date, // date of comment
  save, // save functio
  //send, // send back function
  pageName, // the page name we want to add the comment to
  userAvatar // the user avatar
) {
  // checking the string meet the rules
  if (
    !usernameWhoComment ||
    //usernameWhoComment.length < 5 ||
    //usernameWhoComment.length > 15 ||
    text.length < 5 ||
    text.length > 1000
  ) {
    helper.alertD("name must be 5-15 chars long - text must be 5-1000 chars");
  } else {
    helper.alertD("addRootComment");

    // creating new comment
    let newComment = {
      usernameWhoComment: usernameWhoComment,
      commentId: new Date().getTime(),
      text: text,
      date: date,
      userAvatar: userAvatar
    };

    let pages = websiteFound.pages; // array of pages

    // pulling the object we neeed and assigning it to a value **because its array of objects you can directly modify it ans have the updated value in the original array**
    let pageToAddto = pages.filter(page => page.pageName == pageName)[0];
    let pageCommentsToAddTo = pageToAddto.comments; // grabbing the comment array from the page object we grabbed above ^

    pageCommentsToAddTo.push(newComment); // pushing the root comment to the root page object

    save(); // save the doc
    //send(); // send response
  }
}

// this function decide where to add the comment that has being passed
// to the root artical or to another comment
function whereAddComment(req, res) {
  const {
    siteName, // the name of the site to modify
    pageName, // the name of the page to modify
    commentIdToReplyOn, // the ID of the comment to reply on
    usernameWhoComment, // the username of the user who made the comment
    text, // the text of comment
    date,
    userAvatar
  } = req.body;

  helper.alertD(siteName, pageName, commentIdToReplyOn);

  Website.findOne(
    {
      token: siteName // search website doc by the name given
    },
    (e, siteFound) => {
      // function to save the mongo document
      function saveComment() {
        siteFound.save((e, saved) => {
          // saving doc function
          if (e) console.error("error while saving new comment", e);
          if (saved) {
            helper.alertD("new comment saved");
            res.send("comment saved");
          }
        });
      }

      /**
       ** function meant to let the client know a commant has seen sent
       ** now it has been merged with saveComment()
       **/
      // function sendData() {
      //   res.send("comment saved");
      // }

      if (e)
        res.send({
          error: e
        });
      else if (!siteFound) {
        // if there is no site with that name
        console.log("invoked noSiteFound");
        res.send("noSiteFound");
      } else if (siteFound) {
        // if there is site with that name
        console.log("siteFound");

        let pagesArr = siteFound.pages; // assign the pages array

        // assiging the page we found **because its array of objects you can directly modify it ans have the updated value in the original array**
        let pageFound = pagesArr.filter(item => item.pageName == pageName)[0];

        if (pageFound) {
          // if there is page with that name

          commentIdToReplyOn // if <commentIdToReplyOn> means the user wants to comment on comment because the clients passed the ID to reply on
            ? searchAndAddComment(
                siteFound, // object of the site wewant to modify
                pageFound, // object of the page we want to modify
                commentIdToReplyOn, // the id of the comment to reply on
                usernameWhoComment, // the username of the user who made the comment
                text, // the comment text
                date, // the date of comment
                saveComment, // saving doc function
                //sendData, // sending response function
                pageName, // the name of the page to modify
                userAvatar // the user avatar
              ) // if there isnt <commentIdToReplyOn> means comment on roor
            : addRootComment(
                siteFound, // object of the site wewant to modify
                usernameWhoComment, // object of the page we want to modify
                text, // the comment text
                date, // the date of comment
                saveComment, // saving doc function
                //sendData, // sending response function
                pageName, // the name of the page to modify
                userAvatar // the user avatar
              );
        } else {
          // if there isnt page with that name
          console.log("else");
          // create new page
          let newPage = {
            pageName: pageName,
            id: `${pageName}-${new Date().getTime()}`
          };

          pagesArr.push(newPage); // push page to the array of pages
          addRootComment(
            siteFound, // object of the site wewant to modify
            usernameWhoComment, // object of the page we want to modify
            text, // the comment text
            date, // the date of comment
            saveComment, // saving doc function
            //sendData, // sending response function
            pageName, // the name of the page to modify
            userAvatar // the user avatar
          );
        }
      }
    }
  );
}

router.post("/", (req, res, next) => {
  whereAddComment(req, res);
});

module.exports = router;
