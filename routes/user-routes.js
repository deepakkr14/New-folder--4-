const path = require("path");

const express = require("express");

const userController = require("../controller/user-controller");
const chatController = require("../controller/chat");
const uploadController = require('../controller/upload');

const router = express.Router();
const auth=require('../middleware/auth')

// router.get("/getAll", userController.getEverything);

router.post("/users/singup",userController.postaddNew);
router.post("/users/login",userController.postlogin);
router.post("/users/message",auth,userController.postMessage);
router.get("/users/viewmessage",auth,userController.getMessage);
router.get("/users/clear",auth,userController.clear);


router.post("/createRoom",auth,chatController.createGroup);
router.get("/group",auth,chatController.groupData); //selected group
router.get("/groups",auth,chatController.myGroups);
router.post("/acceptrequest",auth,chatController.acceptRequest);
router.get("/group/members",auth,chatController.getMembers);
router.post("/group/admin/promoteGroupMemberToAdmin",auth,chatController.postPromoteGroupMemberToAdmin);
router.get("/group/admin/removeGroupMember",auth,chatController.deleteGroupMember);
router.post('/group/uploadFile',auth, uploadController.upload.single('file'), uploadController.uploadS3);

// router.post("/add-member",auth,groupController.addMember);

// router.get("/delete/:id", userController.postDelete);


module.exports = router;
