const express = require("express");
const router = express.Router();
const routerAdmin = require("../router/admin");
const checkPermissionUsers = require("../models/checkPermissionUsers");
//==============================================
router.get("/", checkPermissionUsers.checkPermissionAdminUpRequest, routerAdmin.routerIndex);
router.get("/signup", checkPermissionUsers.checkPermissionAdminUpRequest, routerAdmin.getsignup);
router.post("/signup", checkPermissionUsers.checkPermissionAdminUpRequest, routerAdmin.postsignup);
router.get("/signin", routerAdmin.getsignin);
router.post("/signin", routerAdmin.postsignin);
router.get("/post/new", checkPermissionUsers.checkPermissionAdminUpRequest, routerAdmin.getpostnew);
router.post("/post/new", checkPermissionUsers.checkPermissionAdminUpRequest, routerAdmin.postpostnew);
router.get("/post/edit/:id", checkPermissionUsers.checkPermissionAdminUpRequest, routerAdmin.getpostedit);
router.put("/post/edit", checkPermissionUsers.checkPermissionAdminUpRequest, routerAdmin.putpostedit);
router.delete("/post/delete", checkPermissionUsers.checkPermissionAdminUpRequest, routerAdmin.postDelete);
router.delete("/delete", checkPermissionUsers.checkPermissionAdminUpRequest, routerAdmin.deleteUserData);
router.get("/post", checkPermissionUsers.checkPermissionAdminUpRequest, routerAdmin.getpost);
router.get("/user", checkPermissionUsers.checkPermissionAdminUpRequest, routerAdmin.getuser);
router.get("/updateuser/:id", checkPermissionUsers.checkPermissionGuestUpRequest, routerAdmin.getupdateuser);
router.put("/updateuser", checkPermissionUsers.checkPermissionGuestUpRequest, routerAdmin.putupdateuser);
// router.get("/addressBTC", checkPermissionUsers.checkPermissionGuestUpRequest, routerAdmin.addressbtc);
router.get("/qrcode", checkPermissionUsers.checkPermissionGuestUpRequest, routerAdmin.qrcode);
router.get("/hashsha256", checkPermissionUsers.checkPermissionGuestUpRequest, routerAdmin.hashsha256);
router.post("/subscribe", checkPermissionUsers.checkPermissionUserUpRequest, routerAdmin.subscribe);
//==============================================
module.exports = router;