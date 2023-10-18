const Sequelize = require("sequelize");

const sequelize = require("./database");

const Group = sequelize.define("Group", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      groupName:{
        type: Sequelize.STRING,
      }

});

module.exports = Group;
