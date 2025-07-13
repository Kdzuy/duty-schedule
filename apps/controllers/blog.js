const express=require("express");
const router=express.Router();
const routerBlog = require("../router/blog");
//=======================================
router.get("/post/:id", routerBlog.renderPost);
router.get("/about", routerBlog.about);
//=======================================
module.exports=router;