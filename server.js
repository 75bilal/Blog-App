require('dotenv').config()
const express = require("express");
const app = express();
const PORT =  process.env.PORT ||3000;

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");

const blog = require("./models/blog");
const user = require("./models/user");


const path = require("path");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

// connectDB
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log("MongoDB Error =>", err));


//middleware
const { checkAuth, checkAuthorization } = require("./middleware/auth");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(checkAuth);
 //app.use(checkAuthorization);
app.use(express.static(path.resolve("./public")));
// set ejs engine 
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
// checkAuthorization(['USER' ,'ADMIN'])  
//static routes
app.get("/"  ,  async (req, res) => {
  console.log(req.user);
  
    const allBlogs = await blog.find({});
    
    return res.render("home", {
      user: req.user,
      blogs: allBlogs,
    });
}); 

app.get("/dashboard", checkAuthorization(["ADMIN"]), async(req, res) => {
    
 const users = await user.find({});
 const blogs = await blog.find({});


  res.render("adminDashboard", {
    users,
    blogs,
    user : req.user,
  });
});
app.get("/signup", (req, res) => {
  res.render("signup");
});
app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/add-blog", (req, res) => {
  res.render("blog-add");
});

app.get('/search' , async (req,res) => {

   const  keyword = req.query.q?.trim();

   if (!keyword) {
    return res.render('searchResults', {
      user: req.user,
      blogs: [],
      keyword: "",        
      message: "Please enter something to search."
    });
  }
   const results = await blog.find({
    $or: [
      { title: { $regex: keyword, $options: "i" } },
      { content: { $regex: keyword, $options: "i" } }
    ]
  });

  res.render('searchResults', {
    user: req.user,
    blogs: results,
    keyword
  });
});




//routes
app.use("/blog", blogRoute);
app.use("/user", userRoute);

app.listen(PORT, () => {
  console.log(`server start at port ${PORT}`);
});
