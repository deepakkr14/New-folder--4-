require('dotenv').config();
// const Sequelize = require('sequelize');

// const {DB_NAME,DB_USER_NAME,DB_PASSWORD,DB_HOST} = process.env;

// const sequelize = new Sequelize(DB_NAME,DB_USER_NAME,DB_PASSWORD,{
//     host:DB_HOST,
//     dialect:'mysql'
// });


// module.exports = sequelize;

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    dialect: "mysql",
    host: process.env.DB_HOST,
  }
);
module.exports = sequelize;
console.log(process.env.DB_PASSWORD)