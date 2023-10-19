const { DataTypes } = require("sequelize");

const sequelize = require("./sequelize");

const User = sequelize.define("user", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Messages = sequelize.define("chat", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  media: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
  }
});

const Group = sequelize.define("group", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  admin: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: false,
  },
  // link: {
  //     type: DataTypes.STRING,
  //     allowNull: false
  // },
  // createdBy: {
  //     type: DataTypes.INTEGER,
  //     allowNull: false
  // }
});

const GroupsUser = sequelize.define("groupsUser", {});

const ArchivedChats = sequelize.define("archived", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  media: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  groupId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

//user and chat relation, one to many
User.hasMany(Messages);
Messages.belongsTo(User);

//group  and chat relation, one to many
Group.hasMany(Messages, {onDelete: "CASCADE",});
Messages.belongsTo(Group);

//Groups and user relation, many to many
Group.belongsToMany(User, { through: GroupsUser });
User.belongsToMany(Group, { through: GroupsUser });

async function createTable() {
  try {
    await sequelize.sync({ alter: false });

    console.log(`tables created successfully`);
  } catch (err) {
    console.trace(err);
  }
}

createTable();

module.exports = {
  User: User,
  Messages: Messages,
  Group: Group,
  GroupsUser: GroupsUser,
  ArchivedChats: ArchivedChats
};
