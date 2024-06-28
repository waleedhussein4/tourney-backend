const Team = require("../models/teamModels");

const getUUIDFromTeamName = async (teamName) => {
  const team = await Team.findOne({ teamName: teamName });
  return team._id;
}

const getTeamNameFromUUID = async (UUID) => {
  const team = await Team.findOne({ _id: UUID });
  return team.teamName;
}

module.exports = {
  getUUIDFromTeamName,
  getTeamNameFromUUID
}