const express = require("express");
const router = express.Router();
const routerAdmin = require("../router/admin");
const checkPermissionUsers = require("../models/checkPermissionUsers");
//==============================================
router.get("/", checkPermissionUsers.checkPermissionUserUpRequest, routerAdmin.routerIndex);
router.get("/signup", checkPermissionUsers.checkPermissionUserUpRequest, routerAdmin.getsignup);
router.post("/signup", checkPermissionUsers.checkPermissionUserUpRequest, routerAdmin.postsignup);
router.get("/signin", routerAdmin.getsignin);
router.post("/signin", routerAdmin.postsignin);
router.get("/post/new", checkPermissionUsers.checkPermissionUserUpRequest, routerAdmin.getpostnew);
router.post("/post/new", checkPermissionUsers.checkPermissionUserUpRequest, routerAdmin.postpostnew);
router.get("/post/edit/:id", checkPermissionUsers.checkPermissionUserUpRequest, routerAdmin.getpostedit);
router.put("/post/edit", checkPermissionUsers.checkPermissionUserUpRequest, routerAdmin.putpostedit);
router.delete("/post/delete", checkPermissionUsers.checkPermissionUserUpRequest, routerAdmin.postDelete);
router.delete("/delete", checkPermissionUsers.checkPermissionUserUpRequest, routerAdmin.deleteUserData);
router.get("/post", checkPermissionUsers.checkPermissionUserUpRequest, routerAdmin.getpost);
router.get("/user", checkPermissionUsers.checkPermissionUserUpRequest, routerAdmin.getuser);
router.get("/updateuser/:id", checkPermissionUsers.checkPermissionGuestUpRequest, routerAdmin.getupdateuser);
router.put("/updateuser", checkPermissionUsers.checkPermissionGuestUpRequest, routerAdmin.putupdateuser);
// router.get("/addressBTC", checkPermissionUsers.checkPermissionGuestUpRequest, routerAdmin.addressbtc);
router.get("/qrcode", checkPermissionUsers.checkPermissionGuestUpRequest, routerAdmin.qrcode);
router.get("/hashsha256", checkPermissionUsers.checkPermissionGuestUpRequest, routerAdmin.hashsha256);
router.post("/subscribe", checkPermissionUsers.checkPermissionGuestUpRequest, routerAdmin.subscribe);
//==============================================
module.exports = router;