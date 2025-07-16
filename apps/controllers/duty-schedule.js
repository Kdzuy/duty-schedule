const express = require("express");
const router = express.Router();
const routerDuty = require("../router/duty");
const checkPermissionUsers = require("../models/checkPermissionUsers");

router.get("/dashboard", checkPermissionUsers.checkPermissionGuestUpRequest, routerDuty.getRenderHTML);
router.get("/duty-get-json", checkPermissionUsers.checkPermissionGuestUpRequest, routerDuty.getJSON);
router.post("/duty-import-json", checkPermissionUsers.checkPermissionUserUpRequest, routerDuty.importJSON);

//==============================================
module.exports = router;