const express = require("express");
const router = express.Router();
const routerFasterURL = require("../router/fasterurl");
//const checkToken=require("../models/checkToken");
const checkPermissionUsers=require("../models/checkPermissionUsers");
//===============================================
router.get("/",checkPermissionUsers.checkPermissionGuestUpRequest, routerFasterURL.index);
router.get("/listurl",checkPermissionUsers.checkPermissionGuestUpRequest, routerFasterURL.getListURL);
router.post("/new",checkPermissionUsers.checkPermissionGuestUpRequest, routerFasterURL.postnew);
router.delete("/delete",checkPermissionUsers.checkPermissionGuestUpRequest, routerFasterURL.deletePostFaster);
//===============================================
module.exports=router;