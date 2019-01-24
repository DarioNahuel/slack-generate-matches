'use strict'

const Match = use('App/Models/Match');
const User = use('App/Models/User');
const Time = use('App/Models/Time');

class MatchController {

  async index ({ response }) {
    response.json(await Match.all());
  }

  async store ({ request, response }) {
    const { user1_id, user2_id, time_id } = request.all();
    await Match.create({ user1_id, user2_id, time_id });

    const user1 = await User.findOrFail(user1_id);
    const user2 = await User.findOrFail(user2_id);
    const time = await Time.findOrFail(time_id);
    const message = `${user1.name} vs ${user2.name}`;
    response.status(201).json({ message, time: time.hour });
  }

  async destroy ({ request, response }) {
    const { id } = request.params;

    const match = await Match.findOrFail(id);

    await match.delete();

    response.status(204).json('match deleted');
  }
}

module.exports = MatchController
