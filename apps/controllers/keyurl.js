const express = require("express");
const router = express.Router();
const routerKeyURL = require("../router/keyurl");
//==========================================================
router.get("/profile.php", routerKeyURL.profileTrack);
router.get("/permalink.php", routerKeyURL.permalinkTrack);
router.get("/watch", routerKeyURL.watchTrack); 
router.get("/id=:id", routerKeyURL.idTrack);
router.get("/posts=:id", routerKeyURL.postTrack);
router.get("/url=:title", routerKeyURL.getLinkTrack);
router.post("/postdata", routerKeyURL.postip);

module.exports=router;