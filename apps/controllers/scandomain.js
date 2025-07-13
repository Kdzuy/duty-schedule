const express = require("express");
const router = express.Router();
const routerScandomain = require("../router/scandomain");
const checkPermissionUsers=require("../models/checkPermissionUsers");
//=========================================================
router.get("/",checkPermissionUsers.checkPermissionAdminUpRequest, routerScandomain.index);
router.post("/edit", checkPermissionUsers.checkPermissionAdminUpRequest, routerScandomain.editScan);
router.post("/add",checkPermissionUsers.checkPermissionAdminUpRequest, routerScandomain.addScan);
router.delete("/delete",checkPermissionUsers.checkPermissionAdminUpRequest, routerScandomain.deleteScan);
//=========================================================
module.exports=router;