const express = require("express");
const router = express.Router();
const routerAdmin = require("../router/admin");
const checkPermissionUsers = require("../models/checkPermissionUsers");
const checkToken = require("../models/checkToken");
//==============================================
router.get("/", checkToken, checkPermissionUsers.checkPermissionUserUpRequest, routerAdmin.routerIndex);
router.get("/signup", checkToken, checkPermissionUsers.checkPermissionUserUpRequest, routerAdmin.getsignup);
router.post("/signup", checkToken, checkPermissionUsers.checkPermissionUserUpRequest, routerAdmin.postsignup);
router.get("/signin", routerAdmin.getsignin);
router.post("/signin", routerAdmin.postsignin);
router.get("/post/new", checkToken, checkPermissionUsers.checkPermissionUserUpRequest, routerAdmin.getpostnew);
router.post("/post/new", checkToken, checkPermissionUsers.checkPermissionUserUpRequest, routerAdmin.postpostnew);
router.get("/post/edit/:id", checkToken, checkPermissionUsers.checkPermissionUserUpRequest, routerAdmin.getpostedit);
router.put("/post/edit", checkToken, checkPermissionUsers.checkPermissionUserUpRequest, routerAdmin.putpostedit);
router.delete("/post/delete", checkToken, checkPermissionUsers.checkPermissionUserUpRequest, routerAdmin.postDelete);
router.delete("/delete", checkToken, checkPermissionUsers.checkPermissionUserUpRequest, routerAdmin.deleteUserData);
router.get("/post", checkToken, checkPermissionUsers.checkPermissionAdminUpRequest, routerAdmin.getpost);
router.get("/user", checkToken, checkPermissionUsers.checkPermissionAdminUpRequest, routerAdmin.getuser);
router.get("/updateuser/:id", checkToken, checkPermissionUsers.checkPermissionGuestUpRequest, routerAdmin.getupdateuser);
router.put("/updateuser", checkToken, checkPermissionUsers.checkPermissionGuestUpRequest, routerAdmin.putupdateuser);
// router.get("/addressBTC", checkToken, checkPermissionUsers.checkPermissionGuestUpRequest, routerAdmin.addressbtc);
router.get("/qrcode", checkToken, checkPermissionUsers.checkPermissionGuestUpRequest, routerAdmin.qrcode);
router.get("/hashsha256", checkToken, checkPermissionUsers.checkPermissionGuestUpRequest, routerAdmin.hashsha256);
router.post("/subscribe", checkToken, checkPermissionUsers.checkPermissionGuestUpRequest, routerAdmin.subscribe);
//==============================================
module.exports = router;