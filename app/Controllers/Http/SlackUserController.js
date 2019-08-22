'use strict';

const User = use('App/Models/User');

const { slackMessages } = use('App/Controllers/utils.js');

const { createErrorMessage, createSuccessMessage } = slackMessages;

class SlackUserController {
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

  async userUpdate ({ request, response }) {
    try {
      const { text, user_id } = request.body;

      const parameters = text.split(' ');
      if (parameters.length !== 1) {
        const message = createErrorMessage('Wrong number of parameters');
        return response.status(200).json(message);
      }
      const [newName] = parameters;
      
      const user = await User.findBy('slack_id', user_id);
      user.name = newName;
      await user.save();

      const message = createSuccessMessage(`New player Name: ${newName}`);
      response.status(200).json(message);
    } catch (error) {
      //TODO: change error response to catch repeated name or slack_id
      response.status(200).json(createErrorMessage(error.message));
    }
  }
}

module.exports = SlackUserController;
