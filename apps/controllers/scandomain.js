const express = require("express");
const router = express.Router();
const routerScandomain = require("../router/scandomain");
const checkPermissionUsers=require("../models/checkPermissionUsers");
const checkToken=require("../models/checkToken");
//=========================================================
router.get("/", checkToken, checkPermissionUsers.checkPermissionAdminUpRequest, routerScandomain.index);
router.post("/edit", checkToken, checkPermissionUsers.checkPermissionAdminUpRequest, routerScandomain.editScan);
router.post("/add", checkToken, checkPermissionUsers.checkPermissionAdminUpRequest, routerScandomain.addScan);
router.delete("/delete", checkToken, checkPermissionUsers.checkPermissionAdminUpRequest, routerScandomain.deleteScan);
//=========================================================
module.exports=router;