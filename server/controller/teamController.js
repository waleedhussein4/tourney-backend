const e = require("express");
const Team = require("../models/teamModels"); // Path to your Team model
const User = require("../models/userModel"); // Path to your User model
const { default: mongoose } = require("mongoose");
const { v4: uuidv4 } = require('uuid');

function generateAlphanumericId(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const createTeam = async (req, res) => {
  const { name } = req.body;
  const uniqueMembers = new Set(); // Use a Set to avoid duplicates
  uniqueMembers.add(req.user); // Add the leader to the member set
  try {
    // Generate a 6 character long alphanumeric team ID
    const teamId = generateAlphanumericId(6);
    console.log('in try')
    console.log('Creating team with ID:', teamId);
    const team = await Team.create({
      teamId,
      _id: uuidv4(),
      name,
      members: Array.from(uniqueMembers), // Convert Set to Array
      leader: req.user,
      dateCreated: new Date(),
      createdBy: req.user,
    });
    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTeam = async (req, res) => {
  // check if user is part of team

  try {
    const team = await Team.findOne({ _id: req.params.UUID }).populate(
      "members",
      "username email"
    );

    let { _id: UUID, name, members, leader, teamId } = team;

    leader = await User.findOne({ _id: leader }).select('username').lean();
    leader = leader.username

    members = members.map((member) => {
      return {
        username: member.username,
      };
    })

    let requester = await User.findOne({ _id: req.user }).select('username').lean();
    requester = requester.username

    const formattedTeam = { UUID, name, members, leader, isLeader: leader === requester, teamId};
    console.log(formattedTeam)

    res.status(200).json(formattedTeam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTeamsByUser = async (req, res) => {
  try {
    // Assuming user's ID is passed in the request, e.g., from a middleware that validates and attaches user info
    const userId = req.user

    // Query the database for teams where this user is a member, leader, or creator
    const teams = await Team.find({
      $or: [
        { members: userId },
        { leader: userId },
        { createdBy: userId }
      ]
    }).populate('members', 'username email');  // Optionally populate member details

    const returnData = teams.map(team => {
      return {
        UUID: team._id,
        name: team.name,
        members: team.members
      }

    })

    res.status(200).json(returnData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getTeamMembers = async (req, res) => {
  try {
    const team = await Team.findOne({ _id: req.params.id }).populate(
      "members",
      "username email"
    );
    res.status(200).json(team.members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const joinTeam = async (req, res) => {
  try {
    const user = await User.findById(req.user);

    const team = await Team.findOne({ teamId: req.params.teamId }).populate(
      "members",
      "username email"
    );
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (team.members.some(member => member._id.equals(user))) {
      return res.status(400).json({ message: "User is already a member" });
    }

    team.members.push(user);
    await team.save();

    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const changeLeader = async (req, res) => {
  const { newLeader } = req.body;
  try {
    const team = await Team.findOne({ _id: req.params.id })
      .populate("leader", "username email")
      .populate("members", "username email");
    if (!team.members.includes(req.user._id)) {
      return res.status(400).json({ message: "User is not a member" });
    }
    if (team.leader._id !== req.user._id) {
      return res.status(400).json({ message: "User is not the leader" });
    }
    if (!team.members.includes(newLeader)) {
      return res.status(400).json({ message: "New leader is not a member" });
    }
    team.leader = newLeader;
    await team.save();
    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const kickMember = async (req, res) => {
  const { member } = req.body;
  try {
    const team = await Team.findOne({ _id: req.params.id }).populate(
      "members",
      "username email"
    );
    if (!team.members.includes(req.user._id)) {
      return res.status(400).json({ message: "User is not a member" });
    }
    if (team.leader._id !== req.user._id) {
      return res.status(400).json({ message: "User is not the leader" });
    }
    if (!team.members.includes(member)) {
      return res.status(400).json({ message: "Member is not in the team" });
    }
    team.members = team.members.filter((m) => m._id !== member);
    await team.save();
    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTeam = async (req, res) => {
  try {
    const team = await Team.findOne({ _id: req.params.UUID });
    if (team.leader !== req.user) {
      return res.status(400).json({ message: "User is not the leader" });
    }
    await team.deleteOne();
    console.log('Team deleted successfully')
    res.status(200).json({ message: "Team deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const leaveTeam = async (req, res) => {
  try {
    const team = await Team.findOne({ _id: req.params.id })
      .populate("leader", "username email")
      .populate("members", "username email");
    if (!team.members.includes(req.user._id)) {
      return res.status(400).json({ message: "User is not a member" });
    }
    if (team.leader._id === req.user._id) {
      return res.status(400).json({ message: "Leader cannot leave team" });
    }
    team.members = team.members.filter((m) => m._id !== req.user._id);
    await team.save();
    res.status(200).json({ message: "Team left successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTeam,
  getTeam,
  getTeamMembers,
  joinTeam,
  changeLeader,
  kickMember,
  deleteTeam,
  leaveTeam,
  getTeamsByUser
};

