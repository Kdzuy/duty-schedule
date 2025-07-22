const express = require("express");
const router = express.Router();
const routerTodos = require("../router/todos");
const checkToken=require("../models/checkToken");
const checkPermissionUsers=require("../models/checkPermissionUsers");
//===========================================================================================
//node Todos module 
router.get("/dashboard", checkToken, checkPermissionUsers.checkPermissionGuestUpRequest,routerTodos.dashboard);
router.get("/nodetodo", checkToken, checkPermissionUsers.checkPermissionGuestUpRequest, routerTodos.getnodetodo);
router.post("/nodetodo", checkToken, checkPermissionUsers.checkPermissionGuestUpRequest, routerTodos.postnodetodo);
router.put("/nodetodo", checkToken, checkPermissionUsers.checkPermissionGuestUpRequest, routerTodos.putnodetodo);
router.put("/nodetodofn", checkToken, checkPermissionUsers.checkPermissionGuestUpRequest, routerTodos.putnodetodofn);
router.put("/nodetododel", checkToken, checkPermissionUsers.checkPermissionGuestUpRequest, routerTodos.putnodetododel);
router.post("/getchat", checkToken, checkPermissionUsers.checkPermissionGuestUpRequest, routerTodos.getchat);

module.exports=router;