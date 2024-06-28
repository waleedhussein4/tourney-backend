const User = require('../models/userModel');

const getUUIDFromUsername = async (username) => {
  const user = await User.findOne({ username: username });
  return user._id;
}

const getUsernameFromUUID = async (UUID) => {
  const user = await User.findOne({ _id: UUID });
  return user.username;
}

module.exports = {
  getUUIDFromUsername,
  getUsernameFromUUID
}