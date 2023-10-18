const Sequelize = require("sequelize");

const sequelize = require("./database");

const Usergroup = sequelize.define("Usergroup", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
   

});

module.exports = Usergroup;
