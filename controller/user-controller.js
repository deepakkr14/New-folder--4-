const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {Group,User,Messages} = require('../database');

// const User = require("./user-model");
// const Messages = require("./user-messages");
// const Group=require('./group-model')

const secret = "secretkey";
const { Op } = require("sequelize");
exports.postaddNew = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const phone = req.body.phone;

  try {
    const result = await User.findAll({
      where: {
        email: email,
      },
    });

    if (result.length > 0) {
      res.status(202).json(result);
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      await User.create({
        name,
        email,
        phoneNumber:phone,
        password: hashedPassword,
      });

      res.status(201).json({ hashedPassword: hashedPassword });
    }
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "An error occurred while creating user" });
  }
};

exports.postlogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.findOne({ where: { email: email } });
    // console.log(user)
    if (user) {
      const passwordsMatch = await bcrypt.compare(password, user.password);

      if (passwordsMatch) {
        jwt.sign(
          { userId: user.id },
          secret,
          { expiresIn: "2h" },
          (err, token) => {
            res.status(201).json({ message: "Login successful", token: token ,username:user.name});
          }
        );
      } else {
        res
          .status(401)
          .json({ message: "Incorrect password ! User not authorized" });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred" });
  }
};
exports.postMessage = async (req, res) => {
  const message = req.body.message;

  try {
    const messages = await req.user.createMessage({
      messages: message,
    });
    // const mesages= await  req.user.getMessages()
    res.status(200).json({ message: "sent message", userId: req.user.id });
    // console.log(messages)
  } catch (err) {
    res.status(500).json({ message: "message not send" });
    console.log(err);
  }
};
exports.clear = async (req, res) => {
  try {
    const id=req.user.id
    const del = await Messages.destroy({
      where: {
        UserId: id,
      },
    });

    // const del = await req.user.removeMessage(60
    //   )
    console.log("deleted")
    res.status(200).json({ message: "all cleared" });
  } catch {
    (err) => console.log(err);
  }
};
exports.getMessage = async (req, res) => {
  try {
    const index = parseInt(req.query.lastid) || -1;
    const allmsg = await req.user.getMessages({
      attributes: ["id", "messages"],

      where: {
        id: {
          [Op.gt]: index, // Messages with IDs greater than 'index'
        },
      },
    });
    const groups= await req.user.getGroups()
    res.status(202).json({ msg: allmsg ,groups:groups});
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Something went wrong" });
  }};

  // exports.getolderMessage = async (req, res) => {
  // try {
  //   const mesages = await req.user.getMessages({
  //     attributes: ['id', 'messages']
  //   });
  //   res
  //     .status(200)
  //     .json({msg:mesages});
  // }
  // catch {
  //   res.status(500).json({ message: "no message" });
  // }

