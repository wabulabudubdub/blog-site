 var express = require("express"),
    bodyparser = require("body-parser"),
    mongoose = require("mongoose"),
    app = express(),
    override=require("method-override"),
    sanitizer=require("express-sanitizer"),
    port = 6969;

mongoose.connect("mongodb://localhost/RESTful-blog-app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: true}));
app.use(override("_method"));
app.use(sanitizer());
//------------
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  date: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);
//--------------
app.get("/",function(req,res){
  res.redirect("/blogs");
});


app.get("/blogs",function(req,res){
    Blog.find({},function(err,obj){
    if(!err){
    res.render("index",{blogs : obj});
    }

  });
});

app.get("/blogs/new",function(req,res){
  res.render("new");
});

app.post("/blogs",function(req,res){
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog
  ,function(err,obj){
    if(err){
      res.render("new");
    }
    else{
      res.redirect("/blogs");
    }
  }) ;
});

app.get("/blogs/:id",function(req,res){
  Blog.findById(req.params.id, function(err,obj){
    if(err){
      res.redirect("index");
    }
    else{
      res.render("show",{blog: obj});
    }
  })
});

app.get("/blogs/:id/edit",function(req,res){

  Blog.findById(req.params.id, function(err,obj){
    res.render("edit",{blog:obj});
  });
});

app.put("/blogs/:id",function(req,res){
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err,obj){
    if(err){
      res.redirect("/blog");
    }else{
      res.redirect("/blogs/"+req.params.id);
    }

  });
});

app.delete("/blogs/:id",function(req,res){
  Blog.findByIdAndRemove(req.params.id, function(err){
    if(err){
      console.log("error: "+err);
    }
    res.redirect("/blogs");
  }
  );
});


//-------



//---------------
app.listen(port, () => console.log("gotcha..."));
