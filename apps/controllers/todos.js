const express = require("express");
const router = express.Router();
const routerTodos = require("../router/todos");
//const checkToken=require("../models/checkToken");
const checkPermissionUsers=require("../models/checkPermissionUsers");
//===========================================================================================
//node Todos module 
router.get("/dashboard", checkPermissionUsers.checkPermissionGuestUpRequest,routerTodos.dashboard);
router.get("/nodetodo", checkPermissionUsers.checkPermissionGuestUpRequest, routerTodos.getnodetodo);
router.post("/nodetodo", checkPermissionUsers.checkPermissionGuestUpRequest, routerTodos.postnodetodo);
router.put("/nodetodo",  checkPermissionUsers.checkPermissionGuestUpRequest, routerTodos.putnodetodo);
router.put("/nodetodofn", checkPermissionUsers.checkPermissionGuestUpRequest, routerTodos.putnodetodofn);
router.put("/nodetododel", checkPermissionUsers.checkPermissionGuestUpRequest, routerTodos.putnodetododel);
router.post("/getchat", checkPermissionUsers.checkPermissionGuestUpRequest, routerTodos.getchat);

module.exports=router;