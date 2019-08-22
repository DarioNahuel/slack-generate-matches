'use strict';

const axios = require('axios')

const Match = use('App/Models/Match');
const User = use('App/Models/User');
const Time = use('App/Models/Time');

const { slackMessages, formatHour } = use('App/Controllers/utils.js');

const { createChannelMessage, createErrorMessage, blockElements } = slackMessages;

const matchListMessage = async () => {
  const todayMatches = await Match.query()
  .createdToday()
  .withRelated()
  .orderBy('time_id')
  .fetch();

  const text = blockElements.simpleRow('*--- Match list ---*');
  
  const matches = todayMatches.toJSON().map(match => {
    const { time, user1, user2 } = match;
    return user2 ?
      blockElements.simpleRow(`${time.hour}: ${user1.name} vs ${user2.name}`) :
      blockElements.rowWithButton(`${time.hour}: ${user1.name} waiting for Player 2...`, 'Play', `${match.id}`);
  });

  const blocks = [text, blockElements.dividerRow(), ...matches];
  return createChannelMessage(blocks);
}


class SlackMatchController {
  async matchStore ({ request, response }) {
    try {
      const { text, user_id } = request.body;
      const parameters = text.split(' ');

      if ((parameters.length < 1) || (parameters.length > 2)) {
        const message = createErrorMessage('Wrong number of parameters');
        return response.status(200).json(message);
      }
      const [timeHour, opponentName] = parameters;
      
      const user1 = await User.findBy('slack_id', user_id);
      const user2 = opponentName ? await User.findBy('name', opponentName) : null;
      const time = await Time.findBy('hour', formatHour(timeHour));
      
      // TODO: find a better way to handle error messages
      if (!user1) {
        const message = createErrorMessage('Player does not exist \n Try `/playercreate [userName]` before');
        return response.status(200).json(message);
      }
      if (opponentName) {
        if (!user2) {
          const message = createErrorMessage(`User with name ${user2Name} does not exist`);
          return response.status(200).json(message);
        }
        if (user1.id === user2.id) {
          const message = createErrorMessage('Cannot create game against yourself :sweat_smile:');
          return response.status(200).json(message);
        }
      }
      if (!time) {
        const message = createErrorMessage(`Time with hour ${timeHour} does not exist`);
        return response.status(200).json(message);
      }
      if (await Match.taken(time.id)) {      
        const message = createErrorMessage(`Match at ${time.hour} already taken`);
        return response.status(200).json(message);
      }

      await Match.create({
        user1_id: user1.id,
        user2_id: user2 ? user2.id : null,
        time_id: time.id,
      });

      const message = await matchListMessage();
      response.status(200).json(message);
    } catch (error) {
      const message = createErrorMessage(error.message);
      response.status(200).json(message);
    }
  }

  async matchDelete ({ request, response }) {
    try {
      const { text, user_id } = request.body;

      const parameters = text.split(' ');
      if (parameters.length !== 1) {
        const message = createErrorMessage('Wrong number of parameters');
        return response.status(200).json(message);
      }
      const [timeHour] = parameters;
      
      const time = await Time.findBy('hour', formatHour(timeHour));
      const user = await User.findBy('slack_id', user_id);

      if (!time) {
        const message = createErrorMessage(`Time with hour ${timeHour} does not exist`);
        return response.status(200).json(message);
      }

      if (!user) {
        const message = createErrorMessage('Player does not exist \n Try `/playercreate [userName]` before');
        return response.status(200).json(message);
      }

      const match = await Match.query().
        createdToday()
        .where('time_id', time.id).first();

      if (!match) {
        const message = createErrorMessage(`Match at ${time.hour} does not exist`);
        return response.status(200).json(message);
      }

      if (match.user1_id !== user.id && match.user2_id !== user.id) {
        const message = createErrorMessage(`You cant delete a match that do not belongs to you :face_with_raised_eyebrow: `);
        return response.status(200).json(message);
      }

      await match.delete();

      const message = await matchListMessage();
      response.status(200).json(message);
    } catch (error) {
      response.status(200).json(createErrorMessage(error.message));
    }
  }

  async actionsHandler ({ request, response }) {
    try {
      const { user, response_url, actions} = JSON.parse(request.body.payload);
      const matchId = actions[0].value;

      const newPlayer = await User.findBy('slack_id', user.id);
      if (!newPlayer) {
        const message = createErrorMessage('Player does not exist \n Try `/playercreate [userName]` before');
        return response.status(500).json(message);
      }

      const match = await Match.findOrFail(matchId);

      if (match.user1_id == newPlayer.id) {
        const message = createErrorMessage(`You cant accept your own challenge`);
        return response.status(500).json(message);
      }

      match.user2_id = newPlayer.id;
      await match.save();



      const message = await matchListMessage();
      axios.post(response_url, message)
        .then((res) => {
          response.status(200);
        })
        .catch((error) => {
          response.status(500).json(createErrorMessage(error.message));
        })
    } catch (error) {
      //TODO: change error response to catch repeated name or slack_id
      response.status(500).json(createErrorMessage(error.message));
    }
  }
}

module.exports = SlackMatchController;
