'use strict';

const User = use('App/Models/User');

class UserController {
  async index ({ response }) {
    response.json(await User.all());
  }

  async store ({ request, response }) {
    const { name, slackId } = request.all();

    const match = await User.create({
      name,
      slack_id: slackId,
    });

    response.status(201).json(user);
  }

  async destroy ({ request, response }) {
    const { id } = request.params;

    const user = await User.findOrFail(id);

    await user.delete();

    response.status(204);
  }
}

module.exports = UserController;
