'use strict';

const Match = use('App/Models/Match');
const User = use('App/Models/User');
const Time = use('App/Models/Time');

const { createErrorMessage, createSuccessMessage, createChannelMessage, formatHour } = use('App/Controllers/utils.js');

const challengeButton = () => {
  return 'CHALLENGE'
};

const getFormattedList = async () => {
  const todayMatches = await Match.query()
  .createdToday()
  .withRelated()
  .orderBy('time_id')
  .fetch();

  return todayMatches.toJSON().reduce((accumulator, currentValue) => {
    const { time, user1, user2 } = currentValue;
    return `${accumulator}>${time.hour}: ${user1.name} vs ${user2 ? user2.name : challengeButton()}\n`;
  }, []);
}

class SlackController {
  async matchStore ({ request, response }) {
    try {
      const parameters = request.body.text.split(' ');

      if (parameters.length !== 3) {
        const message = createErrorMessage('Wrong number of parameters');
        return response.status(200).json(message);
      }
      const [user1Name, user2Name, timeHour] = parameters;
      
      const user1 = await User.findBy('name', user1Name);
      const user2 = await User.findBy('name', user2Name);
      const time = await Time.findBy('hour', formatHour(timeHour));
      
      // TODO: find a better way to handle error messages
      if (!user1) {
        const message = createErrorMessage(`User with name ${user1Name} does not exist`);
        return response.status(200).json(message);
      }
      if (!user2) {
        const message = createErrorMessage(`User with name ${user2Name} does not exist`);
        return response.status(200).json(message);
      }
      if (!time) {
        const message = createErrorMessage(`Time with hour ${timeHour} does not exist`);
        return response.status(200).json(message);
      }

      if (await Match.taken(time.id)) {      
        const message = createErrorMessage(`Match at ${time.hour} already taken`);
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

      const formattedMatches = await getFormattedList();
      const message = createChannelMessage(`*--- Match list updated ---*\n\n${formattedMatches}`);
      response.status(200).json(message);
    } catch (error) {
      const message = createErrorMessage(error.message);
      response.status(200).json(message);
    }
  }

  async matchChallenge ({ request, response }) {
    try {
      const { text, user_id } = request.body;

      const asd = {
        response_type: 'ephemeral',
        text: '*---Match List updated---*',
        attachments: [
          {
            blocks: [
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: "You can add a button alongside text in your message. "
                },
                accessory: {
                  type: "button",
                  text: {
                    type: "plain_text",
                    text: "Button",
                    emoji: true
                  },
                  value: "click_me_123"
                }
              }
            ]
              
          }
        ],
      };

      return response.status(200).json(asd);
      
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
        const message = createErrorMessage('Slack user not linked\n Try `/linkuser [userName]` before');
        return response.status(200).json(message);
      }
      
      if (await Match.taken(time.id)) {      
        const message = createErrorMessage(`Match at ${time.hour} already taken`);
        return response.status(200).json(message);
      }

      await Match.create({
        user1_id: user.id,
        time_id: time.id,
      });
      const formattedMatches = await getFormattedList();
      const message = createChannelMessage(`*--- Match list updated ---*\n\n${formattedMatches}`);
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
        const message = createErrorMessage('Slack user not linked\n Try `/linkuser [userName]` before');
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

      const formattedMatches = await Match.formattedList();
      const message = createChannelMessage(`*--- Match list updated ---*\n\n${formattedMatches}`);
      response.status(200).json(message);
    } catch (error) {
      response.status(200).json(createErrorMessage(error.message));
    }
  }

  async userStore ({ request, response }) {
    try {
      const { text, user_id } = request.body;

      const parameters = text.split(' ');
      if (parameters.length !== 1) {
        const message = createErrorMessage('Wrong number of parameters');
        return response.status(200).json(message);
      }
      const [name] = parameters;
      
      await User.create({
        name,
        slack_id: user_id,
      });

      const message = createSuccessMessage(`User ${name} created`);
      response.status(201).json(message);
    } catch (error) {
      //TODO: change error response to catch repeated name or slack_id
      response.status(200).json(createErrorMessage(error.message));
    }
  }

  async actionsHandler ({ request, response }) {
    try {
      const { user, response_url} = JSON.parse(request.body.payload);
      console.log(user);
      console.log(response_url);
      console.log(request.body);

      const asd = {
        response_type: 'ephemeral',
        text: '*---Match List updated---*',
        attachments: [
          {
            blocks: [
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: "You can add a button asdasd text in your message. "
                },
              }
            ]
              
          }
        ],
      };
      console.log("123123123213");
      response.status(200).json(asd);
    } catch (error) {
      //TODO: change error response to catch repeated name or slack_id
      response.status(200).json(createErrorMessage(error.message));
    }
  }
}

module.exports = SlackController;
