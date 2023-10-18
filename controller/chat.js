const path = require("path");

const sequelize = require("../sequelize");
const { Op } = require("sequelize");
const { User, Messages, Group, GroupsUser } = require("../database");
exports.postChat = async (req, res, next) => {
  let t = await sequelize.transaction();
  console.log(req.body.text);
  try {
    let chat = await Messages.create(
      {
        message: req.body.text,
        userId: req.user.id,
        groupId: req.body.group,
      },
      { transaction: t }
    );

    res.send("success");

    await t.commit();
  } catch (err) {
    await t.rollback();
    console.trace(err);
    res.send({ error: err });
  }
};
exports.createGroup = async (req, res, next) => {
  let t = await sequelize.transaction();

  const roomName = req.body.roomName;

  try {
    const [group, created] = await Group.findOrCreate({
      where: { name: roomName },
      defaults: { admin: req.user.name },
    });

    if (created) {
      //  modifying the  link table
      await GroupsUser.create({
        userId: req.user.id,
        groupId: group.id,
      });
      //      adding user to this new group
      await t.commit();

      res.status(200).json({ success: true, name: group.name, id: group.id });
      console.log("User created:", group.toJSON());
    } else {
      res.json({ success: false, msg: "GROUP WITH THIS NAME ALREADY EXIST " });
      console.log("User already exists:", group.toJSON());
    }
  } catch (error) {
    console.error("Error finding or creating user:", error);
    res.status(500).json({ msg: error }); // Handle or rethrow the error as needed
    await t.rollback();
  }
};

exports.groupData = async (req, res, next) => {
  let t = await sequelize.transaction();
  let allchat = [];
  const roomid = req.query.name;
  // console.log(roomName);

  try {
    // const groups = await Group.findAll({ where: { name: roomName } });
    const chats = await Messages.findAll({
      where: { groupId: roomid },
      attributes: ["message", "userId"],
      include: [
        {
          model: User,
          attributes: ["name"],
        },
        {
          model: Group,
          attributes: ["admin"],
        },
      ],
    });

    for (let k of chats) {
      allchat.push(k.dataValues);
    }

    // let data = await Messages.findAll({
    //   attributes : ['id','message', 'userId', 'groupId'],
    //   where: {
    //           groupId: roomName
    //   },
    // include: [
    //     {model: User, attributes: ['name']},
    // ]
    // })

    // console.log(data)

    res.status(200).json({ success: true, chats: allchat });
    await t.commit();
  } catch {
    res.status(401).json({ message: "something went wrong" });
    await t.commit();
  }
};

exports.myGroups = async (req, res, next) => {
  let t = await sequelize.transaction();
  let groupdatas = [];
  console.log(req.user.id);

  try {
    const groups = await GroupsUser.findAll({
      where: { userId: req.user.id },
      attributes: ["groupId", "userId"],
    });
    for (let i = 0; i < groups.length; i++) {
      var groupDetails = await Group.findOne({
        where: { id: groups[i].dataValues.groupId },
        attributes: ["id", "name"],
      });
      groupdatas.push(groupDetails);
    }
    await t.commit();
    return res.status(200).json({ success: true, data: groupdatas });
  } catch {
    res.status(401).json({ message: "something went wrong ha aha " });
    await t.rollback();
  }
};
exports.acceptRequest = async (req, res, next) => {
  let t = await sequelize.transaction();

  const uid = req.user.id;
  const gname = req.body.group;
  try {
    const groups = await Group.findAll({
      where: {
        name: [gname],
      },
    });
    console.log(groups[0].dataValues);
    res.json(groups);
    const update = await GroupsUser.create({
      userId: uid,
      groupId: groups[0].dataValues.id,
    });
    res.status(200).json({ status: success, data: update });
    await t.commit();
  } catch {
    (err) => {
      res.status(401).json({ message: "something went wrong ha aha 2 " });
      console.log(err);
    };
    await t.rollback();
  }
};

exports.getMembers = async (req, res, next) => {
  let t = await sequelize.transaction();
  const memberdata = [];
  const gid = Number(req.query.groupId);
  try {
    const member = await GroupsUser.findAll({
      attributes: ["userId"],
      where: { groupId: gid },
      //   include: [
      //         {model: User, attributes: ['name'].where:{userId:}},
      //     ]
    });
    for (let i of member) {
      const value = await User.findOne({
        attributes: ["name", "email"],
        where: { id: i.dataValues.userId },
      });
      memberdata.push(value.dataValues);
    }
    const admin = await Group.findOne({
      attributes: ["admin"],
      where: { id: gid },
      attributes: ["admin"],
    });
    res.status(200).json({ members: memberdata, admin: admin });
    await t.commit();
  } catch {
    (err) => console.log(err);
    await t.rollback();
  }
};
exports.postPromoteGroupMemberToAdmin = async (req, res) => {
  try {
    const memberEmail = req.body.memberEmail;
    const group = req.query.groupId;
    const user = req.user;
    const member = await User.findOne({
      where: { email: memberEmail },
    });

    if (!member) {
      res.status(404).json({ msg: "Member not found" });
      return;
    }
    const memberAdminCheck = await Group.findOne({
      where: { [Op.and]: [{ admin: req.user.name }, { id: group }] },
    });
    if (memberAdminCheck == null) {
      res.status(400).json({ msg: "You are not allowed to do this task" });
      return;
    }
    const status = await Group.update(
      { admin: member.dataValues.name },
      {
        where: { id: group },
      }
    );

    res.status(201).json({
      msg: `Member ${member.name} promoted to Admin by ${req.user.name}`,
    });
  } catch (err) {
    console.log("POST PROMOTE GROUP MEMBER TO ADMIN ERROR");
    res
      .status(500)
      .json({ error: err, msg: "Could not promote group Member to Admin" });
  }
};
exports.deleteGroupMember = async (req, res) => {
  try{
    const memberEmail = req.query.email;
    const group = req.query.groupId;
    const user = req.user;
    const member = await User.findOne({
      where: { email: memberEmail },
    });
      if(req.user.email === memberEmail){
          res.status(400).json({ msg: 'You cannot remove yourself from group. Please use leave group feature' });
          return;
      }
      const memberAdminCheck = await Group.findOne({
        where: { [Op.and]: [{ admin: req.user.name }, { id: group }] },
      });
      if (memberAdminCheck == null) {
        res.status(400).json({ msg: "You are not allowed to do this action" });
        return;
      }
     await GroupsUser.destroy({
        where: {
          UserId:member.dataValues.id, 
          GroupId: group 
        }
      })
      res.status(200).json({ 
          msg: `Member ${member.name} removed from the group by Admin ${req.user.name}` 
      });
  }catch(err){
      console.log('DELETE GROUP MEMBER ERROR');
      res.status(500).json({ error: err, msg: 'Could not delete group member' });
  }
}

exports.postUploadFile = async (req, res) => {
  try{
   
      const userId = req.user.id;
      const groupId = req.query.groupId;

      const file = req.file; 
      
      // const extensionName = path.extname(file.name); // fetch the file extension
      // const allowedExtension = ['.png','.jpg','.jpeg'];
        const date = new Date().toISOString().replace(/:/g,'-');
        const fileName = `Photo_${date}_${userId}_${groupId}_${file}`;
        
        // const fileURL = await S3Services.uploadToS3(file.data, fileName);
        
        console.log('fdfsdff22')
      const chat = await Messages.create({
          message: fileURL,
          userId,
          groupId,
      });

      res.status(201).json(chat);
  }catch(err){
      console.log('POST UPLOAD FILE ERROR');
      res.status(500).json({ error: err, msg: 'Could not upload file' });
  }
}