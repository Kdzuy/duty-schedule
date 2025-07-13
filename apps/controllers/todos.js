const express = require("express");
const router = express.Router();
const routerTodos = require("../router/todos");
//const checkToken=require("../models/checkToken");
const checkPermissionUsers=require("../models/checkPermissionUsers");
//===========================================================================================
//node Todos module 
router.get("/dashboard", checkPermissionUsers.checkPermissionUserUpRequest,routerTodos.dashboard);
router.get("/nodetodo", checkPermissionUsers.checkPermissionUserUpRequest, routerTodos.getnodetodo);
router.post("/nodetodo", checkPermissionUsers.checkPermissionUserUpRequest, routerTodos.postnodetodo);
router.put("/nodetodo",  checkPermissionUsers.checkPermissionUserUpRequest, routerTodos.putnodetodo);
router.put("/nodetodofn", checkPermissionUsers.checkPermissionUserUpRequest, routerTodos.putnodetodofn);
router.put("/nodetododel", checkPermissionUsers.checkPermissionUserUpRequest, routerTodos.putnodetododel);
router.post("/getchat", checkPermissionUsers.checkPermissionUserUpRequest, routerTodos.getchat);

module.exports=router;