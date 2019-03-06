'use strict';

const Match = use('App/Models/Match');
const User = use('App/Models/User');
const Time = use('App/Models/Time');

const { createErrorMessage, createChannelMessage, formatHour } = use('App/Controllers/utils.js');


const matchTaken = async timeId => {
  const matches = await Match.query()
    .createdToday()
    .where('time_id', timeId).fetch();
  return !!matches.size();
};

class SlackController {
  async matchStore ({ request, response }) {
    try {
      const parameters = request.body.text.split(' ');

      const [user1Name, user2Name, timeHour] = parameters;

      const user1 = await User.findByOrFail('name', user1Name.trim());
      const user2 = await User.findByOrFail('name', user2Name.trim());
      const time = await Time.findByOrFail('hour', formatHour(timeHour));

      if (await matchTaken(time.id)) {
        const message = createErrorMessage(`Match at ${timeHour} already taken`);
        return response.status(200).json(message);
      }

      if (user1.id === user2.id) {
        const message = createErrorMessage('[player1] cant be equal to [player2]');
        return response.status(200).json(message);
      }

      await Match.create({
        user1_id: user1.id,
        user2_id: user2.id,
        time_id: time.id,
      });

      const todayMatches = await Match.query()
        .createdToday()
        .withRelated()
        .orderBy('time_id')
        .fetch();

      const formattedMatches = todayMatches.toJSON().reduce((accumulator, currentValue) => {
        const { time, user1, user2 } = currentValue;
        return `${accumulator}>${time.hour}: ${user1.name} vs ${user2.name}\n`;
      }, []);

      const message = createChannelMessage(`*Match list updated:*\n\n${formattedMatches}`);

      response.status(201).json(message);
    } catch (error) {
      const message = createErrorMessage(error.message);
      response.status(200).json(message);
    }
  }
}

module.exports = SlackController;
