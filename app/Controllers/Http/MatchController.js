'use strict'

const Match = use('App/Models/Match');
class MatchController {

  async index ({ response }) {
    response.json(await Match.all());
  }

  async store ({ request, response }) {
    const { user1_id, user2_id, time_id } = request.all();
    const match = await Match.create({ user1_id, user2_id, time_id });
    response.status(201).json(match);
  }

  async destroy ({ request, response }) {
    const { id } = request.params;

    const match = await Match.findOrFail(id);

    await match.delete();

    response.status(204).json('match deleted');
  }
}

module.exports = MatchController
