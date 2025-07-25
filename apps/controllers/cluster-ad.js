const express = require("express");
const router = express.Router();
const routerCluster = require("../router/cluster");
const checkPermissionUsers = require("../models/checkPermissionUsers");
const checkToken = require("../models/checkToken");

router.get("/dashboard", checkToken, checkPermissionUsers.checkPermissionAdminUpRequest, routerCluster.getRenderHTML);
router.get("/get-all-user-guest-clusters", checkToken, checkPermissionUsers.checkPermissionAdminUpRequest, routerCluster.getAllUserGuestClusters);
router.post("/import-cluster", checkToken, checkPermissionUsers.checkPermissionAdminUpRequest, routerCluster.importCluster);
router.delete("/delete-cluster", checkToken, checkPermissionUsers.checkPermissionAdminUpRequest, routerCluster.deleteCluster);

//==============================================
module.exports = router;