//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent = "Welcome to my Blog Page. As you can see there is very little to  be seen but I challenge you to go to http://localhost:3000/compose if you are running on your server and then copose your own article";
const aboutContent = "My name is Michael Esparza and I am computer Science Graduate that didnt fully commit to being a develper until this year! Just like any goal in life, no one is going to hand you the key to success. You have to go out and fight for it!This is one project that I ceated using bootstrap, mongoosedb, and express js to make a server side website that I hope I can run soon host on the internet!";
const contactContent = "Michael espara @ https://www.linkedin.com/in/michael-esparza-075816b2/";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

app.get("/compose", function(req, res){
  res.render("compose");
  /*Post.remove({  }, function(err) {
    if (!err) {// some code to remove ll  things from the database
            message.type = 'notification!';
    }
    else {
            message.type = 'error';
    }*/

});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });


  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;
//i should actually find the right id
console.log(requestedPostId);

  Post.findOne({title: requestedPostId}, function(err, post){
    if(!err){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  }else{
    console.log(err);
  }
  console.log(post);
  });

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
