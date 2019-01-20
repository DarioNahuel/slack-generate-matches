'use strict';

const User = use('App/Models/User');

class UserController {
  async index ({ response }) {
    try {
      response.json(await User.all());
    } catch (error) {
      response.json(error);
    }
  }

  async store ({ request, response }) {
    try {
      const user = await User.create(request.only(['name']));

      response.status(201).json(user);
    } catch (error) {
      response.json(error);
    }
  }
}

module.exports = UserController;
