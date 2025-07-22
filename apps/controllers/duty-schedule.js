const express = require("express");
const router = express.Router();
const routerDuty = require("../router/duty");
const checkPermissionUsers = require("../models/checkPermissionUsers");
const checkToken = require("../models/checkToken");

router.get("/dashboard", checkToken, checkPermissionUsers.checkPermissionGuestUpRequest, routerDuty.getRenderHTML);
router.get("/duty-get-json", checkToken, checkPermissionUsers.checkPermissionGuestUpRequest, routerDuty.getJSON);
router.post("/duty-import-json", checkToken, checkPermissionUsers.checkPermissionUserUpRequest, routerDuty.importJSON);

//==============================================
module.exports = router;