const express = require("express");
const router = express.Router();
const routerFasterURL = require("../router/fasterurl");
const checkToken=require("../models/checkToken");
const checkPermissionUsers=require("../models/checkPermissionUsers");
//===============================================
router.get("/", checkToken, checkPermissionUsers.checkPermissionGuestUpRequest, routerFasterURL.index);
router.get("/listurl", checkToken, checkPermissionUsers.checkPermissionGuestUpRequest, routerFasterURL.getListURL);
router.post("/new", checkToken, checkPermissionUsers.checkPermissionGuestUpRequest, routerFasterURL.postnew);
router.delete("/delete", checkToken, checkPermissionUsers.checkPermissionGuestUpRequest, routerFasterURL.deletePostFaster);
//===============================================
module.exports=router;