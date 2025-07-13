const express = require("express");
const router = express.Router();
const routerIndex = require("../router/index");
const Notifications = require("../models/Notifications");
const axiosScan = require("../models/axiosscanweb");
//const checkToken=require("../models/checkToken");
const checkPermissionUsers = require("../models/checkPermissionUsers");
//thư viện quản lý upload file
//var straintf=require("../models/tensorflow-node");
const schedule = require("node-schedule");
//console.log(process.argv[2]);
//======================================================================================
// const UseApichatGPT=require("../models/UseApichatGPT");
// UseApichatGPT.content_filter_alph('phá hoại');
Notifications.getNotificationDefault("51296", 'Root', process.argv[2] ? 'Server Started: ' + process.argv[2] : "", process.argv[2] ? process.argv[2] + "/admin" : "");
//tạo mới CSDL sqlite3
//const sqlite3 = require("../common/creatlocaldb").addsqlite3();
//======================================================================================  
//chạy kiểm tra để khởi động lại hàm scan web
//const jobAxiosR = schedule.scheduleJob('0 * * * *', async () => await axiosScan.checkpoint());
axiosScan.checkpoint();
//hàm đặt lại lịch quét
const jobRunfaceblocks = schedule.scheduleJob('*/7 * * * *', async () => await axiosScan.RunFaceblocks());
//axiosScan.RunFaceblocks();
//Thông báo công việc của Giao việc
const job = schedule.scheduleJob('0 7 * * *', () => Notifications.getNotificationTodos());
// Notifications.getNotificationTodos();
//======================================================================================
//router index
router.get("/", routerIndex.routerIndex);
router.get("/blog", routerIndex.blog);
// router.get("/chat",checkPermissionUsers.checkPermissionUserUpRequest,routerIndex.chat);
router.post("/upload", checkPermissionUsers.checkPermissionGuestUpRequest, routerIndex.upload);
router.post("/uploadimg", routerIndex.uploadtrack);
router.get('/listimg', checkPermissionUsers.checkPermissionGuestUpRequest, routerIndex.listimg);
router.get('/photo/:id', routerIndex.photo);
router.delete('/deleteimg', checkPermissionUsers.checkPermissionAdminUpRequest, routerIndex.deleteimg);
router.get("/data/:title", checkPermissionUsers.checkPermissionGuestUpRequest, routerIndex.dataTitle);
router.delete("/data/delete", checkPermissionUsers.checkPermissionGuestUpRequest, routerIndex.dataDelete);
//======================================================================================  
//router another
router.use("/admin", require(__dirname + "/admin"));
router.use("/blog", require(__dirname + "/blog"));
// router.use("/track", require(__dirname + "/track"));
// router.use("/fasterurl", require(__dirname + "/fasterurl"));
// router.use("/scandomain", require(__dirname + "/scandomain"));
router.use("/todos", require(__dirname + "/todos"));
router.use("/", require(__dirname + "/keyurl"));
//====================================================================================== 
module.exports = router;
