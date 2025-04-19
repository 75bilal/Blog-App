const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");

const blog = require("../models/blog");
const comment = require("../models/comment");
const { checkAuth, checkAuthorization } = require("../middleware/auth");
//multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./public/uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});
const upload = multer({ storage: storage });

router.post("/", checkAuthorization(['USER' ,"ADMIN"]),upload.single("coverImage"), async (req, res) => {
  const body = req.body;

  if (!body) return res.json({ msg: "enter a blog content" });

  const { title, content } = body;
  const userBlog = await blog.create({
    title,
    content,
    createdBy: req.user._id,
    coverImage: `/uploads/${req.file.filename}`,
  });
  return res.redirect(`/blog/${userBlog._id}`);
});

router.get("/:id", async (req, res) => {
  const findblog = await blog.findById(req.params.id).populate("createdBy");
  const findcomment = await comment
    .find({ blogId: req.params.id })
    .populate("createdBy");
  return res.render("Viewblog", {
    blog: findblog,
    comments: findcomment,
    user: req.user,
  });
});

router.post("/comment/:blogId", async (req, res) => {
  const addComment = await comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });

  return res.redirect(`/blog/${req.params.blogId}`);
});

router.get('/edit/:id' , async (req, res)=>{
  const findblog = await blog.findById(req.params.id).populate("createdBy");

return res.render('edit',{
  user : req.user,
  blog :findblog,
});

});

router.post('/edit/:id', async (req ,res) => {
  const  {title , content} =req.body;
  try {
 const editBlog =await blog.findByIdAndUpdate(req.params.id,{
  title,
  content,
 })
  return res.redirect(`/blog/${req.params.id}`);
 } catch (err) {
  console.error(err);
    res.status(500).send("Server Error");
 }
  console.log('req body form edit route :', req.body);
});

router.get('/delete/:blog_id', async(req , res)=>{
 try {
  await blog.deleteOne({_id : req.params.blog_id });
  return res.redirect('/');
 } catch (err) {
  console.error(err);
    res.status(500).send("Server Error");
 }

});
module.exports = router;
