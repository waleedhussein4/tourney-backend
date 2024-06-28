const Event = require('../models/Event');
const { getUsernameFromUUID } = require('./UserUtils');
const { getTeamNameFromUUID } = require('./TeamUtils');

const getEventsData = async (tournament) => {
  const events = await Promise.all(
    tournament.events.map(async (event) => {
      const eventData = await Event.findById(event);

      if (!eventData) {
        return undefined;
      }

      if (tournament.teamSize == 1) {
        eventData.users = await Promise.all(
          eventData.users.map(async (user) => {
            const username = await getUsernameFromUUID(user);
            return username;
          })
        );
      } else {
        eventData.teams = await Promise.all(
          eventData.teams.map(async (team) => {
            const teamName = await getTeamNameFromUUID(team);
            return teamName;
          })
        );
      }

      return eventData;
    })
  );

  return events.filter(event => event !== undefined);
}

const getEventData = async (event) => {
  const eventData = await Event.findById(event);

  if (!eventData) {
    return undefined;
  }
  
  if (eventData.users.length > 0) {
    eventData.users = await Promise.all(
      eventData.users.map(async (user) => {
        const username = await getUsernameFromUUID(user);
        return username;
      })
    );
  } else {
    eventData.teams = await Promise.all(
      eventData.teams.map(async (team) => {
        const teamName = await getTeamNameFromUUID(team);
        return teamName;
      })
    );
  }

  return eventData;
}

module.exports = {
  getEventsData,
  getEventData
}