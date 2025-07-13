const express = require("express");
const router = express.Router();
const routerTrack = require("../router/track");
//const checkToken=require("../models/checkToken");
const checkPermissionUsers=require("../models/checkPermissionUsers");
//===============================================
router.get("/",checkPermissionUsers.checkPermissionUserUpRequest, routerTrack.index);
router.get("/new",checkPermissionUsers.checkPermissionUserUpRequest, routerTrack.getnew);
router.get("/api", routerTrack.getAPIIp);
router.post("/new",checkPermissionUsers.checkPermissionUserUpRequest, routerTrack.postnew);
router.post("/newkeyreq",checkPermissionUsers.checkPermissionAdminUpRequest, routerTrack.postnewkeyreq);
router.post("/updateadmincheck",checkPermissionUsers.checkPermissionAdminUpRequest, routerTrack.postUpdateAdminCheck);
router.delete("/delete", checkPermissionUsers.checkPermissionUserUpRequest, routerTrack.deleteTrack);
router.delete("/deletekeyreq", checkPermissionUsers.checkPermissionAdminUpRequest,routerTrack.deletekeyreq);
//===============================================
module.exports=router;