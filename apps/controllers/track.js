const express = require("express");
const router = express.Router();
const routerTrack = require("../router/track");
//const checkToken=require("../models/checkToken");
const checkPermissionUsers=require("../models/checkPermissionUsers");
//===============================================
router.get("/", checkToken, checkPermissionUsers.checkPermissionUserUpRequest, routerTrack.index);
router.get("/new", checkToken, checkPermissionUsers.checkPermissionUserUpRequest, routerTrack.getnew);
router.get("/api", routerTrack.getAPIIp);
router.post("/new", checkToken, checkPermissionUsers.checkPermissionUserUpRequest, routerTrack.postnew);
router.post("/newkeyreq", checkToken, checkPermissionUsers.checkPermissionAdminUpRequest, routerTrack.postnewkeyreq);
router.post("/updateadmincheck", checkToken, checkPermissionUsers.checkPermissionAdminUpRequest, routerTrack.postUpdateAdminCheck);
router.delete("/delete", checkToken, checkPermissionUsers.checkPermissionUserUpRequest, routerTrack.deleteTrack);
router.delete("/deletekeyreq", checkToken, checkPermissionUsers.checkPermissionAdminUpRequest,routerTrack.deletekeyreq);
//===============================================
module.exports=router;