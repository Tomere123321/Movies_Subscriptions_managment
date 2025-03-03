const bcrypt = require("bcrypt");
const userModel = require("../Models/userModel");
const permissionService = require("./permissionsService");

const getAllUsers = async () => {
  return await userModel.find({});
};

const getUserById = async (id) => {
  const userId = await userModel.findById(id);
  return userId;
};

const CreateUser = async (user) => {
  user.password = await bcrypt.hash(user.password, 10);
  const newUser = new userModel(user);

  await newUser.save();

  const permissions = newUser.isAdmin
  ? [
      "Create Movies",
      "Update Movies",
      "Delete Movies",
      "Create Subscriptions",
      "Update Subscriptions",
      "Delete Subscriptions",
    ]
  : ["View Movies", "View Subscriptions"];

const permission = {
  userId: newUser._id,
  permissions,
};


  await permissionService.CreatePermission(permission);
  return "User & Permissions Was Created";
};

const updateUser = async (id, newData) => {
  if (newData.password) {
    newData.password = await bcrypt.hash(newData.password, 10);
  }
  await userModel.findByIdAndUpdate(id, newData, { new: true });
  if (newData.permissions) {
    const permissionUpdate = {
      permissions: newData.permissions,
    };
    await permissionService.updatePermission(id, permissionUpdate);
  }
  return "User & Permissions Was Updated";
};

const deleteUser = async (id) => {
  await userModel.findByIdAndDelete(id);
  await permissionService.deletePermission(id);
  return "User & Permissions Was Deleted";
};

module.exports = {
  getAllUsers,
  getUserById,
  CreateUser,
  updateUser,
  deleteUser,
};
