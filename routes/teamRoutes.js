const express = require("express");
const router = express.Router();
const {
  createTeam,
  getTeam,
  getTeamMembers,
  joinTeam,
  changeLeader,
  kickMember,
  deleteTeam,
  leaveTeam,
  getTeamsByUser,
  getTeamByCode,
  getTournamentDisplayTeams
} = require("../controller/teamController"); // Adjust the path as necessary
const { auth, getAuth } = require("../middleware/requireAuth"); // Path to your authentication middleware
const checkTeamMembership = require("../middleware/checkMember");

// Routes
router.post("/create", auth, createTeam); // Create a new team
router.get('/user' ,  auth, getTeamsByUser);
router.get('/user/teamsList', auth, getTournamentDisplayTeams);
router.get("/view/:UUID", auth, getTeam); // Get specific team info, checks membership
router.get("/view/code/:teamCode", auth, getTeamByCode); // Get specific team info by team code
router.get("/view/:UUID/members", auth, getTeamMembers); // Get list of team members, checks membership
router.post("/join/:teamId", auth, joinTeam); // Join a team by ID
router.post("/changeLeader/:UUID", auth, changeLeader); // Change team leader, checks membership
router.post("/kick/:UUID", auth, kickMember); // Kick a member from the team, checks membership
router.delete("/delete/:UUID", auth, deleteTeam); // Delete a team, checks membership
router.post("/leave/:UUID", auth, leaveTeam); // Leave a team

module.exports = router;
