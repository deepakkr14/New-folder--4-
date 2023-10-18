// require("dotenv").config();
// const jwt = require("jsonwebtoken");

// exports.auth = async (req, res, next) => {
//   try {
//     let token = req.header("Authorization");
//     token = JSON.parse(token);
//     //console.trace(token.token, token.messageId);
//     let id = jwt.verify(token.token, process.env.JSON_SECRET_KEY);
//     //console.trace(id);
//     if (id) {
//       token.token = id;
//       req.userId = token;
//       //console.trace(req.userId);
//       next();
//     } else {
//       console.trace("something went wrong in id");
//     }
//   } catch (err) {
//     res.redirect("/login");
//     console.trace(err);
//   }
// };


const jwt = require("jsonwebtoken");
const {User} = require("../database");
const secretKey = "secretkey";

const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
  console.log(token)
    const user = jwt.verify(token, secretKey);
    await User.findByPk(user.userId).then((user) => {

      
      req.user = user;
      next();
      console.log('cannnd')
    }
    );
  } catch (error) {
    console.log(error  + '-------------------auth');
   res.status(401).json({ success: false,error});
  }
};

module.exports = authenticate;
